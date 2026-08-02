import { useEffect, useRef, useState } from 'react';
import DemoShell from '../components/DemoShell';
import { useCanvas } from '../hooks/useCanvas';
import { createRenderBuffer, type RenderBuffer } from './renderBuffer';
import { createRenderer } from './raytracer/RenderRow';
import { DEFAULT_PARAMS, type SceneParams } from './raytracer/params';
import { pickQuality } from './raytracer/quality';


const QUALITY = pickQuality()
const FRAME_BUDGET_MS = 20;

export default function RaytracerDemo() {

  const [draft, setDraft] = useState<SceneParams>(DEFAULT_PARAMS);
  const [params, setParams] = useState<SceneParams>(DEFAULT_PARAMS);
  const [progress, setProgress] = useState(0);

  const isRendering = progress > 0 && progress < 100;
  const dirty = (Object.keys(draft) as (keyof SceneParams)[]).some(
    (k) => draft[k] !== params[k],
  );

  const bufferRef = useRef<RenderBuffer | null>(null);
  if (!bufferRef.current) {
    bufferRef.current = createRenderBuffer(QUALITY.width, QUALITY.height);
  }

  const { canvasRef, present } = useCanvas(
    (ctx, w, h) => {
      const buffer = bufferRef.current;
      if (buffer) ctx.drawImage(buffer.canvas, 0, 0, w, h);
    },
    { smoothing: true },
  );

  useEffect(() => {
    const buffer = bufferRef.current;
    if (!buffer) return;

    const renderer = createRenderer(params, buffer.width, buffer.height);
    const totalRows = buffer.height * renderer.passes;
    let pass = 0;
    let y = 0;
    let raf = 0;
    setProgress(1);

    const frame = () => {
      const started = performance.now();
      const first = y;

      while (pass < renderer.passes && performance.now() - started < FRAME_BUDGET_MS) {
        renderer.renderRow(buffer, y, pass);
        y++;
        if (y >= buffer.height) {
          buffer.commitRows(first, y - first);
          present(buffer.canvas);
          y = 0;
          pass++;
          break;
        }
      }

      if (y > first) {
        buffer.commitRows(first, y - first);
        present(buffer.canvas);
      }

      const done = pass * buffer.height + y;
      if (pass < renderer.passes) {
        setProgress(Math.max(1, Math.round((done / totalRows) * 100)));
        raf = requestAnimationFrame(frame);
      } else {
        setProgress(100);
      }
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [params, present]);

  const controlClass = `demo-control${isRendering ? ' demo-control--off' : ''}`;

  const controls = (
    <>
      <div className="demo-control-group">
        <label className={controlClass}>
          <span className="demo-control-name">balls</span>
          <input
            type="range"
            min={0}
            max={30}
            step={1}
            value={draft.ballCount}
            disabled={isRendering}
            onChange={(e) =>
              setDraft((p) => ({ ...p, ballCount: Number(e.target.value) }))
            }
          />
          <span className="demo-control-value">{draft.ballCount}</span>
        </label>

        <label className={controlClass}>
          <span className="demo-control-name">light</span>
          <input
            type="range"
            min={0}
            max={360}
            step={15}
            value={draft.lightAngle}
            disabled={isRendering}
            onChange={(e) =>
              setDraft((p) => ({ ...p, lightAngle: Number(e.target.value) }))
            }
          />
          <span className="demo-control-value">{draft.lightAngle}&deg;</span>
        </label>

        <label className={controlClass}>
          <span className="demo-control-name">orbit</span>
          <input
            type="range"
            min={0}
            max={360}
            step={5}
            value={draft.cameraYaw}
            disabled={isRendering}
            onChange={(e) =>
              setDraft((p) => ({ ...p, cameraYaw: Number(e.target.value) }))
            }
          />
          <span className="demo-control-value">{draft.cameraYaw}&deg;</span>
        </label>

        <label className={controlClass}>
          <span className="demo-control-name">height</span>
          <input
            type="range"
            min={2}
            max={65}
            step={1}
            value={draft.cameraPitch}
            disabled={isRendering}
            onChange={(e) =>
              setDraft((p) => ({ ...p, cameraPitch: Number(e.target.value) }))
            }
          />
          <span className="demo-control-value">{draft.cameraPitch}&deg;</span>
        </label>
      </div>

      <div className="demo-button-row">
        <button
          type="button"
          className="demo-render"
          disabled={isRendering || !dirty}
          onClick={() => setParams(draft)}
        >
          {isRendering ? `rendering ${progress}%` : 'render'}
        </button>

        <button
          type="button"
          className="demo-render"
          disabled={isRendering}
          onClick={() => {
            const seed = (Math.random() * 0xffffffff) >>> 0;
            setDraft((p) => ({ ...p, seed }));
            setParams({ ...draft, seed });
          }}
        >
          reroll
        </button>
      </div>
    </>
  );

  return (
    <DemoShell title= "RayTracing? Localized entirely within your browser?!?" controls={controls}>
      <canvas ref={canvasRef} className="demo-canvas" />
    </DemoShell>
  );
}