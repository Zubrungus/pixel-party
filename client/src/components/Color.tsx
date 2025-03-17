//import { useRef, useEffect } from "react";

interface IColorProps{
    index: number;
    bgColor: string;
}

export function Color(props: IColorProps){

    return <div className="color" key={props.index} style={{backgroundColor: `rgb(${props.bgColor})`}} />
}