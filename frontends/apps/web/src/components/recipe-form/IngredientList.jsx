import {Minus, Plus} from "lucide-react";
import {Input} from "@/components/ui/input";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";


export const DynamicIngredientList = ({ ingredients, setIngredients }) => {
    const { t } = useTranslation();

    const addIngredient = (ev) => {
        ev.preventDefault();
        setIngredients([...ingredients, { quantity: "", description: "" }]);
    };

    const removeIngredient = (ev, idx) => {
        ev.preventDefault();
        setIngredients(ingredients.filter((_, i) => i !== idx));
    };

    const updateIngredient = (ev, idx, field) => {
        ev.preventDefault();

        const updatedIngredients = ingredients.map((ingredient, i) => {
            if (i === idx) return { ...ingredient, [field]: ev.target.value };
            return ingredient;
        });
        setIngredients(updatedIngredients);
    };

    const handleOnEnter = (ev) => {
        if (ev.key === "Enter") {
            ev.preventDefault();
            addIngredient(ev);
        }
    };

    return (
        <div className="space-y-4">
            {ingredients.map((ingredient, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                    <Input
                        type="number"
                        className="w-28"
                        onKeyDown={handleOnEnter}
                        value={ingredient.quantity}
                        placeholder={t("quantity")}
                        onChange={(ev) => updateIngredient(ev, idx, "quantity")}
                    />
                    <Input
                        className="flex-grow"
                        onKeyDown={handleOnEnter}
                        value={ingredient.description}
                        placeholder={t("ingredient")}
                        onChange={(ev) => updateIngredient(ev, idx, "description")}
                    />
                    <Button variant="outline" size="icon" className="w-[50px]" tabIndex={-1}
                            onClick={(ev) => removeIngredient(ev, idx)} disabled={ingredients.length === 1}>
                        <Minus className="h-4 w-4"/>
                    </Button>
                </div>
            ))}
            <Button onClick={addIngredient} size="sm">
                <Plus className="h-4 w-4 mr-2"/> {t("add")}
            </Button>
        </div>
    );
};
