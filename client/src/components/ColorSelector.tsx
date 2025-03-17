import { useEffect } from "react";
import { Color } from "./Color";


export function ColorSelector() {

    useEffect(() => {

        

        return () => {

        }
    });


    return (
        <>
            <div id="ColorSelector">
                <Color index={1} bgColor={'213, 77, 177'} />
                <Color index={2} bgColor={'211, 150, 175'} />
                <Color index={3} bgColor={'179, 41, 41'} />
                <Color index={4} bgColor={'67, 56, 214'} />
                <Color index={5} bgColor={'223, 119, 22'} />
                <Color index={6} bgColor={'56, 129, 224'} />
                <Color index={7} bgColor={'232, 204, 23'} />
                <Color index={8} bgColor={'117, 225, 225'} />
                <Color index={9} bgColor={'37, 131, 40'} />
                <Color index={10} bgColor={'101, 199, 56'} />
                <Color index={11} bgColor={'120, 86, 59'} />
                <Color index={12} bgColor={'179, 136, 101'} />
                <Color index={13} bgColor={'89, 89, 89'} />
                <Color index={14} bgColor={'147, 147, 154'} />
                <Color index={15} bgColor={'0, 0, 0'} />
                <Color index={16} bgColor={'255, 255, 255'} />
            </div>
        </>
    );
};