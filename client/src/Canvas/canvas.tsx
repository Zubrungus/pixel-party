import {useRef, useEffect} from "react";

interface ICanvasProps {
    height: number;
    width: number;
}

export function Canvas(props: ICanvasProps) {

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        //@ts-expect-error 'canvas' is possibly 'null'.
        const context = canvas.getContext!('2d'); 

        context.fillStyle = 'blue';
        context.fillRect(0, 0, props.width, props.height)

    }, [props.width, props.height])

    return <canvas ref={canvasRef} width={props.width} height={props.height} />;
}

