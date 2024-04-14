import {toast} from "sonner";
import {useState} from "react";
import {cn} from "@/lib/utils";
import {FaTimes} from "react-icons/fa";
import {Input} from "@/components/ui/input";
import {ErrorPage} from "@/pages/ErrorPage";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {useFetchData} from "@/hooks/FetchDataHook";
import {PageTitle} from "@/components/app/PageTitle";
import {useFieldArray, useForm} from "react-hook-form";
import {Loading} from "@/components/app/Loading.jsx";
import {FormButton} from "@/components/app/FormButton.jsx";
import MultipleSelector from "@/components/ui/multiple-selector";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";


const defaultValues = {
    ingredients: [{value: ""}],
    proportions: [{value: ""}],
    steps: [{value: ""}],
};


export const AddRecipePage = () => {
    const [pending, setPending] = useState(false);
    const { apiData, loading, error } = useFetchData("/labels");
    const form = useForm({ defaultValues, shouldFocusError: false });
    const stepsField = useFieldArray({ name: "steps", control: form.control });
    const inField = useFieldArray({ name: "ingredients", control: form.control });
    const propField = useFieldArray({ name: "proportions", control: form.control });

    const apiCall = async (formData) => {
        let response;

        try {
            let body = {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: formData,
            }
            response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/api/add_recipe`, body);
        }
        catch (error) {
            response = {
                ok: false,
                status: 500,
                json: async () => {
                    return {
                        code: 500,
                        message: "Internal Server Error",
                        description: error.toString(),
                    };
                }
            };
        }

        return {
            ok: response.ok,
            status: response.status,
            body: response.status !== 204 ? await response.json() : null,
        }
    }

    const onSubmit = async (data) => {
        const formData = new FormData();

        formData.append("image", data.image);
        try {
            data = { ...data, image: data.image.name };
        } catch {
            data = { ...data };
        }
        formData.append("recipe", JSON.stringify(data));

        setPending(true);
        const response = await apiCall(formData);
        setPending(false);

        if (!response.ok) {
            return toast.error(response.body.description);
        }

        return toast.success(response.body.message);
    };

    const addNewField = () => {
        inField.append({value: ""});
        propField.append({value: ""});
    }

    const removeNewField = (idx) => {
        inField.remove(idx);
        propField.remove(idx);
    }

    if (error) return <ErrorPage {...error}/>;
    if (loading) return <Loading/>;

    return (
        <PageTitle title="Add a Recipe" subtitle="Add a recipe here using the following form">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-7 w-[750px] max-sm:w-full">
                    <div className="bg-card p-3 rounded-md grid grid-cols-12 gap-4">
                        <div className="col-span-12 md:col-span-10">
                            <FormField
                                control={form.control}
                                name="image"
                                render={({field}) =>
                                    <FormItem>
                                        <FormLabel>Add an Image</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                value={field.value?.fileName}
                                                onChange={ev => {
                                                    field.onChange(ev.target.files[0])
                                                }}
                                                type="file"
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                }
                            />
                        </div>
                        <div className="col-span-12 md:col-span-2">
                            <FormField
                                control={form.control}
                                name="servings"
                                rules={{required: "Pour combien ?"}}
                                render={({field}) =>
                                    <FormItem>
                                        <FormLabel>Nb Persons</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                placeholder="4"
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                }
                            />
                        </div>
                    </div>
                    <div className="bg-card p-3 rounded-md grid grid-cols-12 gap-4">
                        <div className="col-span-12 md:col-span-8">
                            <FormField
                                control={form.control}
                                name="title"
                                rules={{required: "Titre requis"}}
                                render={({field}) =>
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                placeholder="Fougasse / Ragout / Bolognaise ..."
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                }
                            />
                        </div>
                        <div className="col-span-6 md:col-span-2">
                            <FormField
                                control={form.control}
                                name="preparation"
                                rules={{required: "Temps requis"}}
                                render={({field}) =>
                                    <FormItem>
                                        <FormLabel>Préparation</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                placeholder="30 min"
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                }
                            />
                        </div>
                        <div className="col-span-6 md:col-span-2">
                            <FormField
                                control={form.control}
                                name="cooking"
                                rules={{required: "Temps requis"}}
                                render={({field}) =>
                                    <FormItem>
                                        <FormLabel>Cuisson</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                placeholder="90 min"
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                }
                            />
                        </div>
                    </div>
                    <div className="bg-card p-3 rounded-md grid grid-cols-12 gap-4">
                        <div className="col-span-3 md:col-span-2">
                            {propField.fields.map((field, idx) => (
                                <FormField
                                    control={form.control}
                                    key={field.id}
                                    name={`proportions.${idx}.value`}
                                    rules={{required: "Quantity is required"}}
                                    render={({field}) =>
                                        <FormItem>
                                            <FormLabel className={cn(idx !== 0 && "sr-only")}>Quantity</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    placeholder="100"
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    }
                                />
                            ))}
                        </div>
                        <div className="col-span-9 md:col-span-10">
                            {inField.fields.map((field, idx) => (
                                <FormField
                                    control={form.control}
                                    key={field.id}
                                    name={`ingredients.${idx}.value`}
                                    rules={{required: "Ingredient is required"}}
                                    render={({field}) =>
                                        <FormItem>
                                            <FormLabel className={cn(idx !== 0 && "sr-only")}>Ingredient</FormLabel>
                                            <div className="flex gap-3 items-center">
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="text"
                                                        placeholder="gr. de poulet"
                                                    />
                                                </FormControl>
                                                {idx !== 0 &&
                                                    <Button variant="ghost" size="sm" role="button" title="Remove field"
                                                            onClick={() => removeNewField(idx)}>
                                                        <FaTimes/>
                                                    </Button>
                                                }
                                            </div>
                                            <FormMessage/>
                                        </FormItem>
                                    }
                                />
                            ))}
                        </div>
                        <div className="col-span-12">
                            <Button type="button" variant="outline" size="sm" onClick={addNewField}>
                                Add More
                            </Button>
                        </div>
                    </div>
                    <div className="bg-card p-3 rounded-md space-y-4">
                        {stepsField.fields.map((field, idx) => (
                            <FormField
                                control={form.control}
                                key={field.id}
                                name={`steps.${idx}.value`}
                                rules={{required: "At least 1 step is required"}}
                                render={({field}) =>
                                    <FormItem>
                                        <FormLabel className={cn(idx !== 0 && "sr-only")}>
                                            Steps
                                        </FormLabel>
                                        <FormDescription className={cn(idx !== 0 && "sr-only")}>
                                            Add every necessary steps to the recipe
                                        </FormDescription>
                                        <div className="flex gap-3 items-center">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    placeholder="Melanger la farine avec l'eau"
                                                />
                                            </FormControl>
                                            {idx !== 0 &&
                                                <Button variant="ghost" size="sm" role="button" title="Remove field"
                                                        onClick={() => stepsField.remove(idx)}>
                                                    <FaTimes/>
                                                </Button>
                                            }
                                        </div>
                                        <FormMessage/>
                                    </FormItem>
                                }
                            />
                        ))}
                        <Button type="button" variant="outline" size="sm"
                                onClick={() => stepsField.append({value: ""})}>
                            Add Step
                        </Button>
                    </div>
                    <div className="bg-card p-3 rounded-md">
                        <FormField
                            name="labels"
                            control={form.control}
                            rules={{ required: "At least 1 label required" }}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        <div>Add labels to the recipe</div>
                                    </FormLabel>
                                    <FormControl>
                                        <MultipleSelector
                                            value={field.value}
                                            onChange={field.onChange}
                                            defaultOptions={apiData}
                                            placeholder="Select labels..."
                                            maxSelected={5}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="bg-card p-3 rounded-md">
                        <FormField
                            name="comment"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <div>Comment</div>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Add a comment"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex justify-start items-center">
                        <FormButton pending={pending} className="w-36">
                            Add Recette
                        </FormButton>
                    </div>
                </form>
            </Form>
        </PageTitle>
    );
};
