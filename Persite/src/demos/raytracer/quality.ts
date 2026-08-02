export type Quality = {
  width: number;
  height: number;
};


export function pickQuality(): Quality {
  const cores = navigator.hardwareConcurrency ?? 4;
  const coarse = window.matchMedia('(pointer: coarse)').matches;

  if (coarse || cores <= 4) {
    return { width: 240, height: 135 };
  }
  return { width: 640, height: 360 };
}