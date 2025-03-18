interface IToggleProps{
    toggleGridHandler: () => void;
}

export function ToggleGrid(props: IToggleProps) {

    return <div id={'toggleButton'} onClick={props.toggleGridHandler}><p>Toggle grid</p><p>#</p></div>
    
}