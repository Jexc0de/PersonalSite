import { interval } from "./interval";
import { Vec3 } from "./Vec3";


type Color = Vec3;

export function linear_to_gamma(linear:number){
  if(linear > 0)
    return Math.sqrt(linear);

  return 0;
}


export function write_color (pixel_color: Color){
    let r = pixel_color.x;
    let g = pixel_color.y;
    let b = pixel_color.z;

    r = linear_to_gamma(r);
    g = linear_to_gamma(g);
    b = linear_to_gamma(b);

    let intensity = new interval(0.000,0.999)
    let rbyte = Math.floor(255.999 * intensity.clamp(r)!);
    let gbyte = Math.floor(255.999 * intensity.clamp(g)!);
    let bbyte = Math.floor(255.999 * intensity.clamp(b)!);

      return `${rbyte} ${gbyte} ${bbyte}\n`;
}   

export function color_to_float(pixel_color: Color): [number, number, number] {
  const intensity = new interval(0.000, 0.999);
  return [
    intensity.clamp(linear_to_gamma(pixel_color.x)),
    intensity.clamp(linear_to_gamma(pixel_color.y)),
    intensity.clamp(linear_to_gamma(pixel_color.z)),
  ];
}