import {Button} from "@/components/ui/button";


export const LabelSelector = ({ labelsList, selectedLabels, setSelectedLabels }) => {
    const toggleLabel = (ev, label) => {
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