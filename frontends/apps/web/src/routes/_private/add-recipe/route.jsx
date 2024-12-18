import {toast} from "sonner";
import {PageTitle} from "@/components/app/PageTitle";
import {useSuspenseQuery} from "@tanstack/react-query";
import {RecipeForm} from "@/components/recipe-form/RecipeForm";
import {createFileRoute, useNavigate} from "@tanstack/react-router";
import {addRecipeOptions, useMutations} from "@famiglia-recipes/api";


// noinspection JSCheckFunctionSignatures,JSUnusedGlobalSymbols
export const Route = createFileRoute("/_private/add-recipe")({
    loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(addRecipeOptions()),
    component: AddRecipePage,
});


function AddRecipePage() {
    const navigate = useNavigate();
    const { addRecipe } = useMutations();
    const { data: labels } = useSuspenseQuery(addRecipeOptions());

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
            onError: (error) => toast.error(error?.description),
            onSuccess: async (data) => {
                toast.success("Recipe Added!");
                await navigate({ to: `/details/${data.recipe_id}`, replace: true });
            },
        });
    };

    return (
        <PageTitle title="Add a Recipe" subtitle="Add a recipe here using the following form">
            <RecipeForm
                labels={labels}
                type={"Creation"}
                onSubmit={onSubmit}
                initValues={initValues}
                pendingState={addRecipe.isPending}
            />
        </PageTitle>
    );
}


