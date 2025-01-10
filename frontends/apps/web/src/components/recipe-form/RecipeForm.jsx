import {useState} from "react";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {useBlocker} from "@tanstack/react-router";
import {ImageCropper} from "@/components/app/ImageCropper";
import {DynamicStepList} from "@/components/recipe-form/StepsList";
import {LabelSelector} from "@/components/recipe-form/LabelSelector";
import {DynamicIngredientList} from "@/components/recipe-form/IngredientList";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";


export const RecipeForm = ({ initValues, onSubmit, labels, pendingState, type }) => {
    const form = useForm({ defaultValues: initValues });
    const [blockerActive, setBlockerActive] = useState(true);

    useBlocker({
        shouldBlockFn: () => {
            if (!form.formState.isDirty) return false;
            if (!blockerActive) return false;
            return !confirm("Are you sure you want to leave? All your changes will be lost.");
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-7 w-[750px] max-sm:w-full">
                <FormField
                    name="image"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Recipe Image</FormLabel>
                            <FormControl>
                                <ImageCropper
                                    aspect={4 / 3}
                                    fileName={field.name}
                                    resultClassName={"h-[150px]"}
                                    onCropApplied={field.onChange}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    name="title"
                    control={form.control}
                    rules={{ required: "Recipe title is required" }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Recipe Title</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Recipe title"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-3 gap-4">
                    <FormField
                        name="preparation"
                        control={form.control}
                        rules={{ required: "Field required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="line-clamp-1">
                                    Preparation Time (min)
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type={"number"}
                                        onChange={(ev) => field.onChange(parseInt(ev.target.value))}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="cooking"
                        control={form.control}
                        rules={{ required: "Field required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="line-clamp-1">
                                    Cooking Time (min)
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type={"number"}
                                        onChange={(ev) => field.onChange(parseInt(ev.target.value))}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="servings"
                        control={form.control}
                        rules={{ required: "Field required" }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Servings</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type={"number"}
                                        onChange={(ev) => field.onChange(parseInt(ev.target.value))}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    name="ingredients"
                    control={form.control}
                    rules={{
                        validate: (value) => {
                            if (!value || value.length === 0) {
                                return "One quantity and ingredient required.";
                            }
                            if (value.some(ing => !ing.quantity.trim() || !ing.description.trim())) {
                                return "All ingredients must have a quantity and a description";
                            }
                            return true;
                        },
                    }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ingredients</FormLabel>
                            <FormControl>
                                <DynamicIngredientList
                                    ingredients={field.value}
                                    setIngredients={field.onChange}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    name="steps"
                    control={form.control}
                    rules={{
                        validate: (value) => {
                            if (!value || value.length === 0) {
                                return "One step required";
                            }
                            if (value.some(step => step.trim() === "")) {
                                return "All steps must have a description";
                            }
                            return true;
                        },
                    }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Steps</FormLabel>
                            <FormControl>
                                <DynamicStepList
                                    steps={field.value}
                                    setSteps={field.onChange}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    name="labels"
                    control={form.control}
                    rules={{ required: "One label required" }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Labels</FormLabel>
                            <FormControl>
                                <LabelSelector
                                    labelsList={labels}
                                    selectedLabels={field.value}
                                    setSelectedLabels={field.onChange}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                {type === "Creation" &&
                    <FormField
                        name="comment"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Comment</FormLabel>
                                <FormControl>
                                    <Textarea {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                }
                <Button type="submit" className="w-52" disabled={pendingState || form.formState.isSubmitting} onClick={() => setBlockerActive(false)}>
                    {type === "Creation" ? "Create Recipe" : "Edit Recipe"}
                </Button>
            </form>
        </Form>
    );
};
