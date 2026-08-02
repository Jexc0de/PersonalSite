import { Vec3 } from "./Vec3";

export class ray{
    
    private orig: Vec3;
    private dir: Vec3;


    constructor(point3: Vec3 = new Vec3(), dir: Vec3 = new Vec3()){
        this.orig = point3;
        this.dir = dir

    }   

    origin(): Vec3{
        return this.orig;
    }
    direction(): Vec3{
        return this.dir;
    }
    at(t:number){
       let lineVector = this.dir.VectorConstMultiplication(t);
       return this.orig.VectorAddition(lineVector);
    }
    set(origin: Vec3, direction: Vec3){
        this.orig = origin.clone();
        this.dir = direction.clone();
    }
}