import type { RenderBuffer } from '../renderBuffer';
import type { SceneParams } from './params';
import { camera } from './camera';
import { buildScene } from './scene';
import { color_to_float } from './color';
import { UnitVector, Vec3 } from './Vec3';


const SAMPLES_PER_PASS = 2;
const PASSES = 8; 
const MAX_DEPTH = 15;

export type Renderer = {
  passes: number;
  renderRow(buffer: RenderBuffer, y: number, pass: number): void;
};

export function createRenderer(
  params: SceneParams,
  width: number,
  height: number,
): Renderer {
  const world = buildScene(params);

  const cam = new camera(width / height, width, SAMPLES_PER_PASS);
  cam.max_depth = MAX_DEPTH;
  cam.defocus_angle = 0;

  const rad = ((params.lightAngle + 180) % 360) * (Math.PI / 180);
  cam.sun_dir = UnitVector(new Vec3(Math.cos(rad), 0.8, Math.sin(rad)));

  const ORBIT_RADIUS = 13.5;
  const yaw = (params.cameraYaw * Math.PI) / 180;
  const pitch = (params.cameraPitch * Math.PI) / 180;
  const horiz = ORBIT_RADIUS * Math.cos(pitch);
  cam.lookfrom = new Vec3(
    horiz * Math.cos(yaw),
    ORBIT_RADIUS * Math.sin(pitch),
    horiz * Math.sin(yaw),
  );

  cam.intialization();

  const accum = new Float64Array(width * height * 3);

  return {
    passes: PASSES,
    renderRow(buffer, y, pass) {
      const inv = 1 / (pass + 1);
      for (let x = 0; x < width; x++) {
        const c = cam.pixelColor(x, y, world);
        const i = (y * width + x) * 3;
        accum[i] += c.x;
        accum[i + 1] += c.y;
        accum[i + 2] += c.z;
        const [r, g, b] = color_to_float(
          new Vec3(accum[i] * inv, accum[i + 1] * inv, accum[i + 2] * inv),
        );
        buffer.setPixel(x, y, r, g, b);
      }
    },
  };
}