import { ray } from "./ray";
import { DotProduct, Vec3 } from "./Vec3";
import { interval } from "./interval";
import type { material } from "./material";

export class hit_record{
    public p :Vec3 = new Vec3 ();
    public normal:Vec3 = new Vec3;
    public t: number = 0;
    public front_face!: boolean;
    public mat!:material;

    set_face_normal(r:ray,outward_normal:Vec3){
        this.front_face = DotProduct(r.direction(),outward_normal)<0;
        this.normal = this.front_face ? outward_normal.clone() : outward_normal.negate();
    }

    copy(other:hit_record){
        this.p = other.p.clone();
        this.t = other.t;
        this.normal = other.normal.clone();
        this.front_face = other.front_face;
        this.mat = other.mat;
    }

}

export abstract class physical{
    abstract hit(r:ray, ray_t:interval ,h_rec:hit_record):boolean;
}