interface IConfirmProps {
    confirmHandler: () => void;
}

export function ConfirmButton(props: IConfirmProps) {

    return <button id="confirmButton" onClick={props.confirmHandler}>Confirm color change</button>
    
}