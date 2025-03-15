import { useRef, useEffect } from "react";

interface ICanvasProps {
    height: number;
    width: number;
    imageData: Uint8ClampedArray<ArrayBuffer>;
}

export function Canvas(props: ICanvasProps) {

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        //@ts-expect-error 'canvas' is possibly 'null'.
        const context = canvas.getContext!('2d');

        const imageData = context.createImageData(100, 100);

        for (let i = 0; i < 40000; i++) {
            imageData.data[i] = props.imageData[i];
        }
        context.putImageData(imageData, 0, 0);

    }, [props.width, props.height, props.imageData])

    return <canvas ref={canvasRef} width={props.width} height={props.height} />;
}

