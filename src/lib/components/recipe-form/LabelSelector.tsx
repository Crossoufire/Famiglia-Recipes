import React from "react";
import {Button} from "~/lib/components/ui/button";

import {LabelType} from "~/lib/server/types/types";


interface LabelSelectorProps {
    labelsList: LabelType[];
    selectedLabels: string[];
    setSelectedLabels: React.Dispatch<React.SetStateAction<string[]>>;
}


export const LabelSelector = ({ labelsList, selectedLabels, setSelectedLabels }: LabelSelectorProps) => {
    const toggleLabel = (ev: React.MouseEvent, label: string) => {
        ev.preventDefault();

        if (selectedLabels.includes(label)) {
            setSelectedLabels(selectedLabels.filter(l => l !== label));
        }
        else {
            setSelectedLabels([...selectedLabels, label]);
        }
    };

    return (
        <div className="flex flex-wrap items-center justify-start gap-2">
            {labelsList.map(label =>
                <Button key={label.name} variant={selectedLabels.includes(label.name) ? "default" : "outline"}
                        onClick={(ev) => toggleLabel(ev, label.name)} className="text-sm rounded-full px-3">
                    {label.name}
                </Button>
            )}
        </div>
    );
};
