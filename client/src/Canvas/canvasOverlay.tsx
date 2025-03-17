import { useRef, useEffect } from 'react';

interface IOveylayProps {
    height: number;
    width: number;
    updateClickX: (pos: number) => void;
    updateClickY: (pos: number) => void;
    lastClickX: number;
    lastClickY: number;
}

export function CanvasOverlay(props: IOveylayProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        //Have to make sure canvas and context have value or typescript complains
        if (canvas) {
            const context = canvas.getContext('2d');
            if (context) {
                //This line is important for making the rows and columns not be darker where they overlap
                context.globalCompositeOperation = "xor";

                //Drawing the grid
                //Set fill style to semi-transparent black then draw along the outer edges
                context.fillStyle = `rgba(0, 0, 0, 0.5)`;
                context.fillRect(0, 0, 1, 500);
                context.fillRect(0, 0, 500, 1);
                context.fillRect(499, 0, 1, 500);
                context.fillRect(0, 499, 500, 1);

                //Draw the columns
                for (let i = 0; i < 99; i++) {
                    context.fillRect((i * 5) + 4, 0, 2, 500);
                }

                //Draw the rows
                for (let i = 0; i < 99; i++) {
                    context.fillRect(0, (i * 5) + 4, 500, 2)
                }

                //Make sure both props are above the default value of -1
                if (props.lastClickX >= 0 && props.lastClickY >= 0) {

                    //multiply by 5, since props
                    const fullX = props.lastClickX * 5;
                    const fullY = props.lastClickY * 5;

                    //Set the fill style to a yellow color then draw the border around the pixel
                    context.fillStyle = `rgb(255, 230, 0)`;
                    context.fillRect(fullX, fullY, 5, 1);
                    context.fillRect(fullX, fullY, 1, 5);
                    context.fillRect(fullX + 4, fullY, 1, 5);
                    context.fillRect(fullX, fullY + 4, 5, 1);
                }

                const handleMouseClick = (event: MouseEvent) => {
                    const rect = canvas.getBoundingClientRect();
                    const x = Math.round(event.clientX - rect.left);
                    const y = Math.round(event.clientY - rect.top);

                    props.updateClickX(x);
                    props.updateClickY(y);
                }

                canvas.addEventListener('click', handleMouseClick)

                return () => {
                    canvas.removeEventListener('click', handleMouseClick)
                }
            }
        }

    }, [props]);

    return <canvas key={1} className='canvas' id="canvasOverlay" ref={canvasRef} width={props.width} height={props.height} />;
}