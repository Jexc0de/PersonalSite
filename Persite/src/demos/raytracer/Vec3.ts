
import {random_double } from "./camera";
export class Vec3{

    public point: number[] = new Array(3);

    constructor(x=0,y=0,z=0){
        this.point = [x,y,z]
    }
    get x(){
        return this.point[0];
    }
    get y(){
        return this.point[1];
    }
    get z(){
        return this.point[2];
    }
    /**
     * negate returns the inverse of a vector*/
   negate(){
    return new Vec3( -(this.point[0]),-(this.point[1]),-(this.point[2]))
   }
   /**
    * index returns the given cord of the vector */
   index(i: number){
    return this.point[i];
   }
   /**
    * functions like the += operator 
    */
   AddVector(v: Vec3){
    this.point[0] += v.point[0];
    this.point[1] += v.point[1];
    this.point[2] += v.point[2];
   }

   /**
    * functions like *= operator */
   VectorMultipy(t: number){
    this.point[0] *= t;
    this.point[1] *= t;
    this.point[2] *= t;
   }
   set(v: Vec3){
        this.point[0] = v.point[0];
        this.point[1] = v.point[1];
        this.point[2] = v.point[2];
    }
   /**
    * functions like /= operator
    */
   VectorDivide(t: number){
    this.VectorMultipy(1/t);
   }
   /**
    * 
    * @returns the squared length of the vector
    */
   length_squared(){
    return this.point[0]*this.point[0] + this.point[1]*this.point[1] + this.point[2]*this.point[2];
   }
   length(){
    return  Math.sqrt(this.length_squared());
   }

   static random(){
    return new Vec3(random_double(),random_double(),random_double());
   }
   
   static rangedRandom(min:number, max:number){
    return new Vec3(random_double(min,max),random_double(min,max),random_double(min,max));
   }


   position(){
    return `${this.point[0]} ${this.point[1]} ${this.point[2]}`;
   }
   /**
    * Adds a given Vector V via addition
    * @param v The vector to add by, RHS
    * @returns a new vector
    */
    VectorAddition(v:Vec3){
        return new Vec3(this.point[0]+v.point[0],this.point[1]+v.point[1],this.point[2]+v.point[2]);
    }
    /**
     * Subtracts a given vector V
     * @returns a new vector
     */
    VectorSubtraction(v:Vec3){
        return new Vec3(this.point[0]-v.point[0],this.point[1]-v.point[1],this.point[2]-v.point[2]);
    }
    /**
     * Multiplys the current vector by a given Vector v
     * @returns a new Vector
     */
    VectorMultiplication(v:Vec3){
        return new Vec3(this.point[0]*v.point[0],this.point[1]*v.point[1],this.point[2]*v.point[2]);
    }
    /**
     * Multiples the vector by a given constant
     * @returns a new Vector
     */
    VectorConstMultiplication(x:number){
        return new Vec3(this.point[0]*x,this.point[1]*x,this.point[2]*x);
    }
    /**
     * Divides a vector by a given constant
     * @returns a new Vector
     */
    VectorDivision(t:number){
        return new Vec3(this.point[0]/t,this.point[1]/t,this.point[2]/t);
    }

    clone(){
    return new Vec3(this.point[0], this.point[1], this.point[2]);
    }

   /**
    * functions like the += operator. MUTATES in place
    * call on a vector allocated in the current scope.
    */
   addAssign(v: Vec3){
    this.point[0] += v.point[0];
    this.point[1] += v.point[1];
    this.point[2] += v.point[2];
    }

   /** functions like *= operator. MUTATES in place. */
   mulAssign(t: number){
    this.point[0] *= t;
    this.point[1] *= t;
    this.point[2] *= t;
    }

   /** functions like /= operator. MUTATES in place. */
   divAssign(t: number){
    this.mulAssign(1/t);
    }

    nearZero(){
        let limit = 1e-8;
        return (Math.abs(this.point[0]) < limit ) && 
        Math.abs(this.point[1]) < limit && 
        Math.abs(this.point[2]) < limit; 
    }

}

export function DotProduct(v:Vec3, u:Vec3){
    return (v.point[0] * u.point[0]) + (v.point[1] * u.point[1]) + (v.point[2] * u.point[2])
}

export function CrossProduct(v:Vec3, u:Vec3){
    return  new Vec3(v.point[1]*u.point[2] - v.point[2]*u.point[1],
                        v.point[2]*u.point[0] - v.point[0]*u.point[2],
                        v.point[0]*u.point[1] - v.point[1]*u.point[0]
                        );
}

export function UnitVector(v:Vec3):Vec3{
    return v.VectorDivision(v.length())

}

export function randomUnitVector(){
    while(true){
        let p = Vec3.rangedRandom(-1,1);
        let lensq = p.length_squared();
        if( 1e-160 < lensq && lensq <= 1){
            return p.VectorDivision(Math.sqrt(lensq));
        }
    }
}

export function randomOnHemisphere(normal:Vec3){
    let on_unit_square = randomUnitVector();
    if(DotProduct(on_unit_square,normal) > 0){
        return on_unit_square;
    }
    else{
        return on_unit_square.negate();
    }
}


export function reflect(v:Vec3, n:Vec3){
    return v.VectorSubtraction(n.VectorConstMultiplication( 2 * DotProduct(v,n)));
}

//To calcuate the direction of a refracted ray (R), R' = R'(perpendicular) + R' (parallel),
//solve for both perp and para, which is what this function does
//most functions feel pretty clear but this ones a lil messy
export function refract(uv:Vec3, n:Vec3, etai_over_etat:number){
    let cos_theta = Math.min(DotProduct(uv.negate(),n),1);
    let inter = uv.VectorAddition(n.VectorConstMultiplication(cos_theta));
    let r_out_perp = inter.VectorConstMultiplication(etai_over_etat);
    let r_out_para = n.VectorConstMultiplication(Math.sqrt(Math.abs(1-r_out_perp.length_squared()))).negate();
    return r_out_perp.VectorAddition(r_out_para);
}

export function randomInUnitDisk(){
        while(true){
            let p = new Vec3(random_double(-1,1),random_double(-1,1),0);
            if(p.length_squared()<1)
                return p;
        }
    }
