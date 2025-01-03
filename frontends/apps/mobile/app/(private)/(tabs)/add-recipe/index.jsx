import {useRouter} from "expo-router";
import {useQuery} from "@tanstack/react-query";
import {Text, ToastAndroid, View} from "react-native";
import {RecipeForm} from "@/components/recipe-form/RecipeForm";
import {addRecipeOptions, useMutations} from "@famiglia-recipes/api";


export default function AddRecipeScreen() {
    const router = useRouter();
    const { addRecipe } = useMutations();
    const { data: labels, isLoading, error } = useQuery(addRecipeOptions());

    if (isLoading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error?.description}</Text>;

    const initValues = {
        title: "",
        servings: 2,
        preparation: 30,
        cooking: 30,
        ingredients: [],
        steps: [],
        labels: [],
        comment: "",
    };

    const onSubmit = async (submittedData) => {
        const formData = new FormData();

        formData.append("image", submittedData.image);
        try {
            submittedData = { ...submittedData, image: submittedData.image.name };
        }
        catch {
            submittedData = { ...submittedData };
        }
        formData.append("recipe", JSON.stringify(submittedData));

        addRecipe.mutate({ data: formData }, {
            onError: (error) => ToastAndroid.show(error?.description, ToastAndroid.SHORT),
            onSuccess: async (data) => {
                ToastAndroid.show("Recipe Added!", ToastAndroid.SHORT);
                router.replace(`/details/${data.recipe_id}`);
            },
        });
    };

    return (
        <View style={{ padding: 10 }}>
            <RecipeForm
                labels={labels}
                type={"Creation"}
                onSubmit={onSubmit}
                initValues={initValues}
                pendingState={addRecipe.isPending}
            />
        </View>
    );
}


