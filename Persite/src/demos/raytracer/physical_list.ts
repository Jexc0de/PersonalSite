import { interval } from "./interval";
import { hit_record, physical } from "./physical";
import { ray } from "./ray";
import { sphere } from "./sphere";

export class physical_list extends physical{
    public objects: sphere[] = [];
    constructor(object:sphere | null){
        super();
        if(object){
            this.add(object);
        }

    }

    add(object:sphere){
        this.objects.push(object);
    }

    clear(){
        this.objects = [];
    }

    hit(r:ray, ray_t:interval, h_rec:hit_record):boolean{
        let temp_rec: hit_record = new hit_record();
        let hit_anything: boolean = false;
        let current_closest: number = ray_t.max;

        for(const sphere of this.objects){
            if(sphere.hit(r, new interval(ray_t.min,current_closest),temp_rec)){
                hit_anything = true;
                current_closest = temp_rec.t;
                h_rec.copy(temp_rec);
            }
        }
        return hit_anything;
    }
}