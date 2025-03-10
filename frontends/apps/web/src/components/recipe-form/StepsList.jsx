import {Minus, Plus} from "lucide-react";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";


export const DynamicStepList = ({ steps, setSteps }) => {
    const { t } = useTranslation();

    const addStep = (ev) => {
        ev.preventDefault();
        setSteps([...steps, ""]);
    };

    const removeStep = (idx) => {
        setSteps(steps.filter((_, i) => i !== idx));
    };

    const updateStep = (idx, value) => {
        setSteps(steps.map((step, i) => (i === idx ? value : step)));
    };

    return (
        <div className="space-y-4">
            {steps.map((step, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                    <Textarea
                        value={step}
                        className="flex-grow"
                        placeholder={`${t("step")} ${idx + 1}`}
                        onChange={(ev) => updateStep(idx, ev.target.value)}
                    />
                    <Button variant="outline" size="icon" className="w-[40px]" tabIndex={-1}
                            onClick={() => removeStep(idx)} disabled={steps.length === 1}>
                        <Minus className="h-4 w-4"/>
                    </Button>
                </div>
            ))}
            <Button onClick={addStep} size="sm">
                <Plus className="h-4 w-4 mr-2"/> {t("add")}
            </Button>
        </div>
    );
};