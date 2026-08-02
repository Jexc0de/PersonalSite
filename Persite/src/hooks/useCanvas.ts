import { useCallback, useEffect, useRef } from 'react';

export type CanvasDraw = (
  ctx: CanvasRenderingContext2D,
  width: number,  
  height: number, 
) => void;


type UseCanvasOptions = {
    smoothing?: boolean;
};

  export function useCanvas(
    onResize?: CanvasDraw,
    options: UseCanvasOptions = {},
  ) {
    const { smoothing = true } = options;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const sizeRef = useRef({width:0, height:0 });

    const onResizeRef = useRef(onResize);
    const smoothingRef = useRef(smoothing);
    useEffect(() => {
      const canvas = canvasRef.current;
      const stage = canvas?.parentElement;
      if(!canvas || !stage ) return;

      const fit = () => {
        const rect = stage.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        canvas.width = Math.max(1, Math.round(rect.width * dpr));
        canvas.height = Math.max(1,Math.round(rect.height * dpr));

        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        sizeRef.current = { width: rect.width, height: rect.height};

        const ctx = canvas.getContext('2d')
        if(!ctx) return;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.imageSmoothingEnabled = smoothingRef.current;
        onResizeRef.current?.(ctx, rect.width, rect.height);
      };

      const observer = new ResizeObserver(fit);
      observer.observe(stage);
      fit();

      return () => observer.disconnect();
    }, []);

    const present = useCallback((source: CanvasImageSource) => {
      const ctx = canvasRef.current?.getContext('2d');
      if(!ctx) return;
      const { width, height} = sizeRef.current;
      ctx.drawImage(source, 0, 0, width, height);
    }, []);
    return {canvasRef, present, sizeRef};
  }