import {Minus, Plus} from "lucide-react";
import {useEffect, useState} from "react";


interface ServingsProps {
    initServings: number;
    multiSetter: (multiplier: number) => void;
}


export const Servings = ({ initServings, multiSetter }: ServingsProps) => {
    const [disabled, setDisabled] = useState(false);
    const [servings, setServings] = useState(initServings);

    useEffect(() => {
        setServings(initServings);
    }, [initServings]);

    const updateServings = (action: "add" | "remove") => {
        let newServing = initServings;

        if (action === "add") {
            newServing = servings + 1;
            setDisabled(false);
        }

        if (action === "remove") {
            newServing = servings - 1;
            if (newServing === 1) {
                setDisabled(true);
            }
        }

        setServings(newServing);
        multiSetter(newServing / initServings);
    };

    return (
        <div className="flex items-center justify-around gap-2">
            {disabled ?
                <Minus className="w-4 h-4"/>
                :
                <div role="button" onClick={() => updateServings("remove")}>
                    <Minus className="w-4 h-4 hover:opacity-70"/>
                </div>
            }
            {servings} pers.
            <div role="button" onClick={() => updateServings("add")}>
                <Plus className="w-4 h-4 hover:opacity-70"/>
            </div>
        </div>
    );
};
