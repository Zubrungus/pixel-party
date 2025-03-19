interface IZoomProps{
    increaseZoomHandler: () => void;
    decreaseZoomHandler: () => void;
}

export function ZoomButtons(props: IZoomProps) {
    return (
    <div id={'zoomButtons'}>
        <div id={'increaseZoom'} onClick={props.increaseZoomHandler}>+</div>
        <div id={'decreaseZoom'} onClick={props.decreaseZoomHandler}>-</div>
    </div>

    )
}