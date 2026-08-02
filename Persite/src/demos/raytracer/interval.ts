
export class interval {
    min:number;
    max:number;

    constructor(min = Infinity, max = -Infinity){
        this.min = min;
        this.max = max;
    }
    size(){
        return this.max - this.min;
    }
    contains(x:number){
        return this.max >= x && this.min <= x;
    }

    surrounds(x:number){
        return this.max > x && this.min < x;
    }
    clamp(x:number){
        if(x<this.min)
            return this.min;
        if(x>this.max)
            return this.max;
        return x;

    }

    static readonly empty = new interval(Infinity,-Infinity);
    static readonly universe = new interval(-Infinity,Infinity);
}
