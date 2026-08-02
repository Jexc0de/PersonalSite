import { interval } from "./interval";
import { hit_record, physical } from "./physical";
import { ray } from "./ray";
import { CrossProduct, UnitVector, Vec3, randomInUnitDisk, DotProduct } from "./Vec3";


export const pi:number = 3.1415926535897932385;

export function random_double(min=0,max=1){
    return Math.random() * (max-min) + min;
}

function degrees_to_radians(degrees:number){
    return degrees*pi/180.0;
}



export class camera{

   
    aspect_ratio:number;
    image_width:number;
    samples_per_pixel:number;
    max_depth = 50;

    vfov = 20;
    lookfrom = new Vec3(18,3,16);
    lookat = new Vec3(0,0,0);
    public vup = new Vec3(0,1,0);
    sun_dir = new Vec3(0, 1, 0);

    defocus_angle = .01;
    focus_dist = 1;

    constructor(aspect_ratio:number,image_width:number,samples_per_pixel:number){
        this.aspect_ratio = aspect_ratio;
        this.image_width = image_width;
        this.samples_per_pixel = samples_per_pixel;

    }

    private image_height!: number;
    private pixel_sample_scales!: number;
    private center!: Vec3;
    private origin_pixel!: Vec3;
    private pixel_delta_u!:Vec3;
    private pixel_delta_v!:Vec3;
    private u!:Vec3;
    private v!:Vec3;
    private w!:Vec3;
    private defocus_disk_u!:Vec3;
    private defocus_disk_v!:Vec3;

    render()
    {
        this.intialization();

       
    }

    public intialization()
    {
        this.image_height = Math.round(this.image_width / this.aspect_ratio);
        this.image_height = (this.image_height < 1) ? 1 : this.image_height;
        this.pixel_sample_scales = 1.0 / this.samples_per_pixel;

        this.center = this.lookfrom;
         //Camera POV
        
        let theta = degrees_to_radians(this.vfov);
        let h = Math.tan(theta/2);
        let viewport_height = 2 * h * this.focus_dist;
        let viewport_width = viewport_height*(this.image_width/this.image_height);

        this.w = UnitVector(this.lookfrom.VectorSubtraction(this.lookat));
        this.u = UnitVector(CrossProduct(this.vup,this.w));
        this.v = CrossProduct(this.w,this.u);


        //Calculate the vectors across the horizontal and vertical viewport edges
        let viewport_u = this.u.VectorConstMultiplication(viewport_width);
        let viewport_v = this.v.VectorConstMultiplication(viewport_height).negate();

        //Calculate the pixel to pixel deleta for horizontal and vertical vectors
        this.pixel_delta_u = viewport_u.VectorDivision(this.image_width);
        this.pixel_delta_v = viewport_v.VectorDivision(this.image_height);

        //Calculate location of upper left hand pixel.
        let view_U = viewport_u.VectorDivision(2);
        let view_V = viewport_v.VectorDivision(2);

        let camera_focal = this.center.VectorSubtraction(this.w.VectorConstMultiplication(this.focus_dist));
        let intermediate = camera_focal.VectorSubtraction(view_U);
        let viewport_upper_left = intermediate.VectorSubtraction(view_V);
        let p_delta_uv = this.pixel_delta_u.VectorAddition(this.pixel_delta_v);
        let scaled_p_delta_uv = p_delta_uv.VectorConstMultiplication(.5);
        this.origin_pixel = viewport_upper_left.VectorAddition(scaled_p_delta_uv);

        let defocus_radius = this.focus_dist * Math.tan(degrees_to_radians(this.defocus_angle/2))
        this.defocus_disk_u = this.u.VectorConstMultiplication(defocus_radius);
        this.defocus_disk_v = this.v.VectorConstMultiplication(defocus_radius);
    }

    get height() {
        return this.image_height;
    }

    pixelColor(i: number, j: number, world: physical): Vec3 {
        let pixel_color = new Vec3(0, 0, 0);
        for (let sample = 0; sample < this.samples_per_pixel; sample++) {
            let r = this.get_ray(i, j);
            pixel_color.addAssign(this.ray_color(r, this.max_depth, world));
        }
        return pixel_color.VectorConstMultiplication(this.pixel_sample_scales);
    }

    private get_ray(i:number,j:number){
        let offset = this.sample_square();
        let inter = this.origin_pixel.VectorAddition(this.pixel_delta_u.VectorConstMultiplication(offset.x + i));
        let pixel_sample = inter.VectorAddition(this.pixel_delta_v.VectorConstMultiplication(offset.y+j));

        let ray_origin = (this.defocus_angle<=0) ? this.center : this.defocus_disk_sample();
        let ray_direction = pixel_sample.VectorSubtraction(ray_origin);

        return new ray(ray_origin,ray_direction);

    }


    private sample_square(){
        return new Vec3(random_double() -.5, random_double() - .5 , 0)
    }
    private ray_color(r:ray, depth:number, world:physical) : Vec3
    {
        if(depth<=0)
            return new Vec3(0,0,0);
        let rec:hit_record = new hit_record();
        if (world.hit(r,new interval(0.001,Infinity),rec))
        {
            let scattered = new ray;
            let attenuation = new Vec3;
            if(rec.mat.scatter(r,rec,attenuation,scattered))
                    return attenuation.VectorMultiplication(this.ray_color(scattered,depth-1,world));
            return new Vec3(0,0,0);
             
        } 
        let unit_direction = UnitVector(r.direction());
        let a = .5 * (DotProduct(unit_direction, this.sun_dir) + 1.0);
        let LHS = new Vec3(1,1,1).VectorConstMultiplication(1-a);
        let RHS = new Vec3(.5,.7,1).VectorConstMultiplication(a);
        return RHS.VectorAddition(LHS);
    }

    private defocus_disk_sample(){
        let p = randomInUnitDisk();
        let LHS = this.defocus_disk_u.VectorConstMultiplication(p.x)
        let RHS = this.defocus_disk_v.VectorConstMultiplication(p.y)
        return this.center.VectorAddition(LHS.VectorAddition(RHS));
    }
}