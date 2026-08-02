import { Vec3 } from './Vec3';
import { sphere } from './sphere';
import { physical_list } from './physical_list';
import { lambertian, metal, dielectric, type material } from './material';
import type { SceneParams } from './params';


function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FEATURE_CENTERS = [
  new Vec3(0, 1, 0),
  new Vec3(-4, 1, 0),
  new Vec3(4, 1, 0),
];

export function buildScene(params: SceneParams): physical_list {
  const rand = mulberry32(params.seed);
  const rng = (min = 0, max = 1) => rand() * (max - min) + min;

  const world = new physical_list(null);
  world.add(
    new sphere(new Vec3(0, -1000, 0), 1000, new lambertian(new Vec3(0.5, 0.5, 0.5))),
  );


const centers: Vec3[] = [];
  let placed = 0;
  let guard = 0;
  while (placed < params.ballCount && guard++ < 800) {
    const center = new Vec3(rng(-6, 7), 0.2, rng(-4.5, 4.5));
    if (FEATURE_CENTERS.some((c) => center.VectorSubtraction(c).length() < 1.4)) {
      continue;
    }
    if (centers.some((c) => center.VectorSubtraction(c).length() < 0.5)) {
      continue;
    }
    centers.push(center);

    const pick = rand();
    let mat: material;
    if (pick < 0.8) {
      mat = new lambertian(
        new Vec3(rng() * rng(), rng() * rng(), rng() * rng()),
      );
    } else if (pick < 0.95) {
      mat = new metal(
        new Vec3(rng(0.5, 1), rng(0.5, 1), rng(0.5, 1)),
        rng(0, 0.5),
      );
    } else {
      mat = new dielectric(1.5);
    }

    world.add(new sphere(center, 0.2, mat));
    placed++;
  }

  world.add(new sphere(FEATURE_CENTERS[0], 1.0, new dielectric(1.5)));
  world.add(
    new sphere(FEATURE_CENTERS[1], 1.0, new lambertian(new Vec3(0.4, 0.2, 0.1))),
  );
  world.add(
    new sphere(FEATURE_CENTERS[2], 1.0, new metal(new Vec3(0.7, 0.6, 0.5), 0.0)),
  );

  return world;
}