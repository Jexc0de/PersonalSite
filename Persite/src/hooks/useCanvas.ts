import { useEffect, useRef } from 'react';

export type CanvasDraw = (
  ctx: CanvasRenderingContext2D,
  width: number,  // CSS pixels
  height: number, // CSS pixels
) => void;


export function useCanvas(onResize?: CanvasDraw) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);


  const onResizeRef = useRef(onResize);
  useEffect(() => {
    onResizeRef.current = onResize;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = canvas?.parentElement;
    if (!canvas || !stage) return;

    const fit = () => {
      const rect = stage.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      // physical pixel buffer sized for sharpness...
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      // ...displayed at CSS size
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      // 1 drawing unit = 1 CSS pixel for shapes/paths
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      onResizeRef.current?.(ctx, rect.width, rect.height);
    };

    const observer = new ResizeObserver(fit);
    observer.observe(stage);
    fit();

    return () => observer.disconnect();
  }, []);

  return canvasRef;
}