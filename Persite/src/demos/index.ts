import type { ComponentType } from 'react';
import RaytracerDemo from './RaytracerDemo'


export type DemoEntry = {
  id: string;
  title: string;
  component: ComponentType;
};

export const demos: DemoEntry[] = [
  { id: 'raytracer', title: 'TypeScript raytracer', component: RaytracerDemo },
];


export const activeDemo: DemoEntry | null = demos[0] ?? null;