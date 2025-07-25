import React from "react";
import {Minus, Plus} from "lucide-react";
import {useTranslation} from "react-i18next";
import {Input} from "~/lib/components/ui/input";
import {Button} from "~/lib/components/ui/button";
import {Control, useFieldArray} from "react-hook-form";
import {RecipeFormValues} from "~/lib/server/utils/schemas";
import {FormControl, FormField, FormItem, FormMessage} from "~/lib/components/ui/form";


interface DynIngListProps {
    control: Control<RecipeFormValues>;
}


export const DynamicIngredientList = ({ control }: DynIngListProps) => {
    const { t } = useTranslation();
    const { fields, append, remove } = useFieldArray({ control, name: "ingredients" });

    const addIngredient = (ev: React.MouseEvent | React.KeyboardEvent) => {
        ev.preventDefault();
        append({ quantity: "", description: "" });
    };

    const removeIngredient = (ev: React.MouseEvent, idx: number) => {
        ev.preventDefault();
        remove(idx);
    };

    const handleOnEnter = (ev: React.KeyboardEvent) => {
        if (ev.key === "Enter") {
            ev.preventDefault();
            addIngredient(ev);
        }
    };

    return (
        <div className="space-y-4">
            {fields.map((field, idx) =>
                <div key={field.id} className="flex items-center space-x-2">
                    <FormField
                        control={control}
                        name={`ingredients.${idx}.quantity`}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="number"
                                        className="w-28"
                                        onKeyDown={handleOnEnter}
                                        placeholder={t("quantity")}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name={`ingredients.${idx}.description`}
                        render={({ field }) => (
                            <FormItem className="flex-grow">
                                <FormControl>
                                    <Input
                                        {...field}
                                        className="flex-grow"
                                        onKeyDown={handleOnEnter}
                                        placeholder={t("ingredient")}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button
                        size="icon"
                        tabIndex={-1}
                        variant="outline"
                        className="w-[50px]"
                        disabled={fields.length === 1}
                        onClick={(ev) => removeIngredient(ev, idx)}
                    >
                        <Minus className="h-4 w-4"/>
                    </Button>
                </div>
            )}
            <Button onClick={addIngredient} size="sm">
                <Plus className="h-4 w-4 mr-2"/> {t("add")}
            </Button>
        </div>
    );
};
