import { physical,hit_record } from "./physical";
import { Vec3,DotProduct } from "./Vec3";
import { ray } from "./ray";
import { interval } from "./interval";
import { material } from "./material";
export class sphere extends physical {
    center:Vec3;
    radius:number;
    mat:material;


    constructor(center:Vec3,radius:number,mat:material){
        super();
        this.center = center;
        this.radius = Math.max(0,radius);
        this.mat = mat;
    }

    hit(r:ray, ray_t:interval ,h_rec:hit_record):boolean{
        let oc:Vec3 = this.center.VectorSubtraction(r.origin());
        let a = r.direction().length_squared();
        let h = DotProduct(r.direction(),oc);
        let c =  oc.length_squared() - this.radius*this.radius;
        
        let discriminant = h*h - a*c;
        if(discriminant<0){
            return false;
        }
        let sqrtd = Math.sqrt(discriminant);

        let root = (h-sqrtd) /a;
        if(!ray_t.surrounds(root)){
            root = (h+sqrtd)/a;
            if(!ray_t.surrounds(root)){
                return false;
            }
        }
        h_rec.mat = this.mat;
        h_rec.t = root;
        h_rec.p = r.at(h_rec.t);
        let outward_normal:Vec3 =  h_rec.p.VectorSubtraction(this.center).VectorDivision(this.radius);
        h_rec.set_face_normal(r,outward_normal);
        return true;
    }

}