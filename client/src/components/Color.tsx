interface IColorProps {
    index: number;
    bgColor: string;
    clickedColorHandler: (color: number) => void;
    clickedColor: number;
}

export function Color(props: IColorProps) {
    //On click, run the clicked color handler to pass the index of the clicked color back up to App.tsx
    const handleClick = () => {
        props.clickedColorHandler(props.index)
    }

    //If a color button is the last clicked color, give it a large gold colored border
    if (props.clickedColor == props.index) {
        return <div onClick={handleClick} className="color" style={{ backgroundColor: `rgb(${props.bgColor})`, border: `2px solid rgb(255, 187, 0)`, /*margin: 'calc(2% - 2px) calc(7% - 2px)'*/ }} />
    } else {
        return <div onClick={handleClick} className="color" style={{ backgroundColor: `rgb(${props.bgColor})`, border: `2px solid rgb(44, 44, 44)`, /*margin: '2% 7%'*/ }} />
    }
}