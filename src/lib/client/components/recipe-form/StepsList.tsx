import React from "react";
import {Minus, Plus} from "lucide-react";
import {useTranslation} from "react-i18next";
import {Button} from "~/lib/client/components/ui/button";
import {Textarea} from "~/lib/client/components/ui/textarea";
import {Control, useFieldArray} from "react-hook-form";
import {RecipeFormValues} from "~/lib/utils/schemas";
import {FormControl, FormField, FormItem, FormMessage} from "~/lib/client/components/ui/form";


interface DynamicStepListProps {
    control: Control<RecipeFormValues>;
}


export const DynamicStepList = ({ control }: DynamicStepListProps) => {
    const { t } = useTranslation();
    const { fields, append, remove } = useFieldArray({ control, name: "steps" });

    const addStep = (ev: React.MouseEvent) => {
        ev.preventDefault();
        append({ content: "" });
    };

    const removeStep = (idx: number) => {
        remove(idx);
    };

    return (
        <div className="space-y-4">
            {fields.map((field, idx) =>
                <div key={field.id} className="flex items-start space-x-2">
                    <FormField
                        control={control}
                        name={`steps.${idx}.content`}
                        render={({ field }) =>
                            <FormItem className="flex-grow">
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        className="flex-grow"
                                        placeholder={`${t("step")} ${idx + 1}`}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        }
                    />
                    <Button
                        size="icon"
                        tabIndex={-1}
                        variant="outline"
                        className="w-[40px]"
                        disabled={fields.length === 1}
                        onClick={() => removeStep(idx)}
                    >
                        <Minus className="h-4 w-4"/>
                    </Button>
                </div>
            )}
            <Button onClick={addStep} size="sm">
                <Plus className="h-4 w-4 mr-2"/> {t("add")}
            </Button>
        </div>
    );
};