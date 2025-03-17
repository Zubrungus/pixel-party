import { Color } from "./Color";

interface IColorSelectorProps {
    clickedColorHandler: (color: number) => void;
    clickedColor: number;
}

export function ColorSelector(props: IColorSelectorProps) {

    //Render 16 color buttons, each with a different color
    return (
        <>
            <div id="ColorSelector">
                <Color clickedColorHandler={props.clickedColorHandler} clickedColor={props.clickedColor} index={1} bgColor={'179, 41, 41'} />
                <Color clickedColorHandler={props.clickedColorHandler} clickedColor={props.clickedColor} index={2} bgColor={'67, 56, 214'} />
                <Color clickedColorHandler={props.clickedColorHandler} clickedColor={props.clickedColor} index={3} bgColor={'223, 119, 22'} />
                <Color clickedColorHandler={props.clickedColorHandler} clickedColor={props.clickedColor} index={4} bgColor={'56, 129, 224'} />
                <Color clickedColorHandler={props.clickedColorHandler} clickedColor={props.clickedColor} index={5} bgColor={'232, 204, 23'} />
                <Color clickedColorHandler={props.clickedColorHandler} clickedColor={props.clickedColor} index={6} bgColor={'117, 225, 225'} />
                <Color clickedColorHandler={props.clickedColorHandler} clickedColor={props.clickedColor} index={7} bgColor={'37, 131, 40'} />
                <Color clickedColorHandler={props.clickedColorHandler} clickedColor={props.clickedColor} index={8} bgColor={'101, 199, 56'} />
                <Color clickedColorHandler={props.clickedColorHandler} clickedColor={props.clickedColor} index={9} bgColor={'213, 77, 177'} />
                <Color clickedColorHandler={props.clickedColorHandler} clickedColor={props.clickedColor} index={10} bgColor={'211, 150, 175'} />
                <Color clickedColorHandler={props.clickedColorHandler} clickedColor={props.clickedColor} index={11} bgColor={'120, 86, 59'} />
                <Color clickedColorHandler={props.clickedColorHandler} clickedColor={props.clickedColor} index={12} bgColor={'179, 136, 101'} />
                <Color clickedColorHandler={props.clickedColorHandler} clickedColor={props.clickedColor} index={13} bgColor={'89, 89, 89'} />
                <Color clickedColorHandler={props.clickedColorHandler} clickedColor={props.clickedColor} index={14} bgColor={'147, 147, 154'} />
                <Color clickedColorHandler={props.clickedColorHandler} clickedColor={props.clickedColor} index={15} bgColor={'0, 0, 0'} />
                <Color clickedColorHandler={props.clickedColorHandler} clickedColor={props.clickedColor} index={16} bgColor={'255, 255, 255'} />
            </div>
        </>
    );
};