import { useRef, useEffect } from "react";

//interface for props that will be received from App.tsx
interface ICanvasProps {
    height: number;
    width: number;
    imageData: Uint8ClampedArray<ArrayBuffer>;
}

export function Canvas(props: ICanvasProps) {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        //Have to make sure canvas and context have value or typescript complains
        if (canvas) {
            const context = canvas.getContext('2d');
            if (context) {


                //Prep the imageData, which in this case will be a 100 pixel by 100 pixel image. each pixel's RGBA value is 0, 0, 0, 0 by default
                const imageData = context.createImageData(100, 100);

                //For whatever reason you can't just set imageData.data all at once, so you have to individually set each element of the array one at a time
                for (let i = 0; i < 40000; i++) {
                    imageData.data[i] = props.imageData[i];
                }

                //This line is what actually draws the imageData to the canvas
                context.putImageData(imageData, 0, 0);
            }
        }

    }, [props]);




    return <canvas key={2} id="canvasBackground" ref={canvasRef} width={props.width} height={props.height} />;
}

