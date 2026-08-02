import { random_double } from "./camera";
import { hit_record, physical } from "./physical";
import { ray } from "./ray";
import { randomUnitVector, Vec3, reflect, UnitVector, DotProduct, refract } from "./Vec3";

export abstract class material{

    scatter(r:ray, rec:hit_record, attenuation:Vec3, scattered:ray){
        return false;
    }
}

export class lambertian extends material{
    protected albedo:Vec3;
    constructor(albedo:Vec3){
        super();
        this.albedo = albedo;
    }
    scatter(r: ray, rec: hit_record, attenuation: Vec3, scattered: ray): boolean {
        let scatter_dir = rec.normal.VectorAddition(randomUnitVector());

        if(scatter_dir.nearZero()){
            scatter_dir = rec.normal;
        }

        scattered.set(rec.p, scatter_dir);
        attenuation.set(this.albedo);
        return true;
    }


    
}

export class metal extends material{
    protected albedo:Vec3;
    protected fuzz:number;
    constructor(albedo:Vec3,fuzz:number){
        super();
        this.albedo = albedo;
        this.fuzz = fuzz < 1 ? fuzz : 1;
    }
    scatter(r: ray, rec: hit_record, attenuation: Vec3, scattered: ray): boolean {
        let reflected = reflect(r.direction(),rec.normal);
        let fuzzing = randomUnitVector().VectorConstMultiplication(this.fuzz); 
        reflected.set(UnitVector(reflected).VectorAddition(fuzzing));
        scattered.set(rec.p,reflected);
        attenuation.set(this.albedo);
        return (DotProduct(scattered.direction(),rec.normal)>0);
    }
    
}


export class dielectric extends material{
    private refraction_index:number;
    constructor(refraction_index:number){
        super();
        this.refraction_index = refraction_index;
    }
    scatter(r: ray, rec: hit_record, attenuation: Vec3, scattered: ray): boolean {
        attenuation.set(new Vec3(1,1,1));
        let ri = rec.front_face ? (1/this.refraction_index) : this.refraction_index;
        let unit_dir = UnitVector(r.direction());
        let cos_theta = Math.min(DotProduct(unit_dir.negate(),rec.normal),1);
        let sin_theta = Math.sqrt(1 - cos_theta*cos_theta);

        let NoRefaction = ri * sin_theta > 1;
        let direction:Vec3;

        if(NoRefaction || this.reflectance(cos_theta,ri) > random_double()){
            direction = reflect(unit_dir,rec.normal);
        }
        else{
            direction = refract(unit_dir,rec.normal,ri)
        }
        scattered.set(rec.p,direction);
        return true;
    }

    reflectance(cosine:number, refraction_index:number){
        let r0 = (1- refraction_index) / (1+refraction_index);
        r0 *= r0;
        return r0 + (1-r0)*Math.pow((1-cosine),5);
    }
}