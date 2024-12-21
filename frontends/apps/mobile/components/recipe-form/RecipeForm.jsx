import {Controller, useForm} from "react-hook-form";
import {ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";


export const RecipeForm = ({ initValues, onSubmit, labels, pendingState, type }) => {
    const form = useForm({ defaultValues: initValues });

    return (
        <ScrollView>
            <Controller
                name="title"
                control={form.control}
                rules={{ required: true }}
                render={({ field }) => (
                    <View className="flex flex-col gap-2 mb-4">
                        <Text className="line-clamp-1 text-white">
                            Recipe title
                        </Text>
                        <TextInput
                            value={field.value}
                            onBlur={field.onBlur}
                            placeholder={"Recipe title"}
                            onChangeText={field.onChange}
                            placeholderTextColor={"#838383"}
                            className={"text-white border border-neutral-500 rounded-lg"}
                        />
                        {form?.errors?.title && <Text className="text-red-500">Field required</Text>}
                    </View>
                )}
            />
            <Controller
                name="preparation"
                control={form.control}
                rules={{ required: true }}
                render={({ field }) => (
                    <View className="flex flex-col gap-2 mb-4">
                        <Text className="line-clamp-1 text-white">
                            Preparation time (min)
                        </Text>
                        <TextInput
                            placeholder={"30"}
                            value={field.value}
                            onBlur={field.onBlur}
                            onChangeText={field.onChange}
                            placeholderTextColor={"#838383"}
                            className={"text-white border border-neutral-500 rounded-lg"}
                        />
                        {form?.errors?.preparation && <Text className="text-red-500">Field required</Text>}
                    </View>
                )}
            />
            <Controller
                name="cooking"
                control={form.control}
                rules={{ required: true }}
                render={({ field }) => (
                    <View className="flex flex-col gap-2 mb-4">
                        <Text className="line-clamp-1 text-white">
                            Cooking time (min)
                        </Text>
                        <TextInput
                            placeholder={"30"}
                            value={field.value}
                            onBlur={field.onBlur}
                            onChangeText={field.onChange}
                            placeholderTextColor={"#838383"}
                            className={"text-white border border-neutral-500 rounded-lg"}
                        />
                        {form?.errors?.cooking && <Text className="text-red-500">Field required</Text>}
                    </View>
                )}
            />
            <Controller
                name="servings"
                control={form.control}
                rules={{ required: true }}
                render={({ field }) => (
                    <View className="flex flex-col gap-2 mb-4">
                        <Text className="line-clamp-1 text-white">
                            Servings
                        </Text>
                        <TextInput
                            placeholder={"2"}
                            value={field.value}
                            onBlur={field.onBlur}
                            onChangeText={field.onChange}
                            placeholderTextColor={"#838383"}
                            className={"text-white border border-neutral-500 rounded-lg"}
                        />
                        {form?.errors?.servings && <Text className="text-red-500">Field required</Text>}
                    </View>
                )}
            />
            <Controller
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
                    <View className="flex flex-col gap-2 mb-4">
                        <Text className="line-clamp-1 text-white">
                            Ingredients
                        </Text>
                        {form?.errors?.ingredients && <Text className="text-red-500">Field required</Text>}
                    </View>
                )}
            />
            {/*<FormField*/}
            {/*    name="ingredients"*/}
            {/*    control={form.control}*/}
            {/*    rules={{*/}
            {/*        validate: (value) => {*/}
            {/*            if (!value || value.length === 0) {*/}
            {/*                return "One quantity and ingredient required.";*/}
            {/*            }*/}
            {/*            if (value.some(ing => !ing.quantity.trim() || !ing.description.trim())) {*/}
            {/*                return "All ingredients must have a quantity and a description";*/}
            {/*            }*/}
            {/*            return true;*/}
            {/*        },*/}
            {/*    }}*/}
            {/*    render={({ field }) => (*/}
            {/*        <FormItem>*/}
            {/*            <FormLabel>Ingredients</FormLabel>*/}
            {/*            <FormControl>*/}
            {/*                <DynamicIngredientList*/}
            {/*                    ingredients={field.value}*/}
            {/*                    setIngredients={field.onChange}*/}
            {/*                />*/}
            {/*            </FormControl>*/}
            {/*            <FormMessage/>*/}
            {/*        </FormItem>*/}
            {/*    )}*/}
            {/*/>*/}
            {/*<FormField*/}
            {/*    name="steps"*/}
            {/*    control={form.control}*/}
            {/*    rules={{*/}
            {/*        validate: (value) => {*/}
            {/*            if (!value || value.length === 0) {*/}
            {/*                return "One step required";*/}
            {/*            }*/}
            {/*            if (value.some(step => step.trim() === "")) {*/}
            {/*                return "All steps must have a description";*/}
            {/*            }*/}
            {/*            return true;*/}
            {/*        },*/}
            {/*    }}*/}
            {/*    render={({ field }) => (*/}
            {/*        <FormItem>*/}
            {/*            <FormLabel>Steps</FormLabel>*/}
            {/*            <FormControl>*/}
            {/*                <DynamicStepList*/}
            {/*                    steps={field.value}*/}
            {/*                    setSteps={field.onChange}*/}
            {/*                />*/}
            {/*            </FormControl>*/}
            {/*            <FormMessage/>*/}
            {/*        </FormItem>*/}
            {/*    )}*/}
            {/*/>*/}
            {/*<FormField*/}
            {/*    name="labels"*/}
            {/*    control={form.control}*/}
            {/*    rules={{ required: "One label required" }}*/}
            {/*    render={({ field }) => (*/}
            {/*        <FormItem>*/}
            {/*            <FormLabel>Labels</FormLabel>*/}
            {/*            <FormControl>*/}
            {/*                <LabelSelector*/}
            {/*                    labelsList={labels}*/}
            {/*                    selectedLabels={field.value}*/}
            {/*                    setSelectedLabels={field.onChange}*/}
            {/*                />*/}
            {/*            </FormControl>*/}
            {/*            <FormMessage/>*/}
            {/*        </FormItem>*/}
            {/*    )}*/}
            {/*/>*/}
            {/*<FormField*/}
            {/*    name="comment"*/}
            {/*    control={form.control}*/}
            {/*    render={({ field }) => (*/}
            {/*        <FormItem>*/}
            {/*            <FormLabel>Comment</FormLabel>*/}
            {/*            <FormControl>*/}
            {/*                <Textarea {...field}/>*/}
            {/*            </FormControl>*/}
            {/*            <FormMessage/>*/}
            {/*        </FormItem>*/}
            {/*    )}*/}
            {/*/>*/}
            <TouchableOpacity className="w-full bg-blue-500 rounded-md items-center p-3 mt-6" onPress={() => form.handleSubmit(onSubmit)}
                              disabled={pendingState || form.formState.isSubmitting}>
                <Text className="text-white font-bold">
                    {type === "Creation" ? "Create Recipe" : "Edit Recipe"}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};
