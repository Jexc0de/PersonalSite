export type RenderBuffer = {
    canvas: HTMLCanvasElement;
    image: ImageData,
    width: number;
    height: number;

    setPixel(x:number, y:number, r:number, g: number, b:number): void;
    commitRow(y:number): void;
    commitRows(y:number,count:number): void;
    clear(): void;
};
    export function createRenderBuffer(width:number, height:number): RenderBuffer {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if(!ctx) throw new Error('2d context unavilable');

        const image = ctx.createImageData(width, height);
        const data = image.data;
        return {
        canvas,
        image,
        width,
        height,

        setPixel(x, y, r, g, b) {
        const i = (y * width + x) * 4;
        data[i] = r * 255;
        data[i + 1] = g * 255;
        data[i + 2] = b * 255;
        data[i + 3] = 255;
        },

        commitRow(y){
            ctx.putImageData(image, 0, 0, 0, y, width, 1);
        },

        commitRows(y, count) {
            ctx.putImageData(image, 0, 0, 0, y, width, count);
        },

        clear(){
            data.fill(0);
            ctx.clearRect(0, 0, width, height);
        },
    };    
}
