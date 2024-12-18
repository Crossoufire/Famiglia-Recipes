import {toast} from "sonner";
import {PageTitle} from "@/components/app/PageTitle";
import {useMutations} from "@famiglia-recipes/api";
import {useSuspenseQuery} from "@tanstack/react-query";
import {createFileRoute, useNavigate} from "@tanstack/react-router";
import {editRecipeOptions} from "@famiglia-recipes/api/src/queryOptions";
import {RecipeForm} from "@/components/recipe-form/RecipeForm";


// noinspection JSCheckFunctionSignatures,JSUnusedGlobalSymbols
export const Route = createFileRoute("/_private/edit-recipe/$recipeId")({
    loader: ({ context: { queryClient }, params: { recipeId } }) => queryClient.ensureQueryData(editRecipeOptions(recipeId)),
    component: EditRecipePage,
});


function EditRecipePage() {
    const navigate = useNavigate();
    const { recipeId } = Route.useParams();
    const { updateRecipe } = useMutations();
    const { data: recipe } = useSuspenseQuery(editRecipeOptions(recipeId));
    const initValues = {
        title: recipe.fields.title,
        servings: recipe.fields.servings,
        preparation: recipe.fields.prep_time,
        cooking: recipe.fields.cooking_time,
        ingredients: recipe.fields.ingredients.map(i => ({ quantity: i.proportion, description: i.ingredient })),
        steps: recipe.fields.steps.map(i => i.description),
        labels: recipe.fields.labels.map(i => i.name),
        comment: recipe.fields.comment,
    };

    const onSubmit = async (data) => {
        const formData = new FormData();

        formData.append("image", data.image);
        try {
            data = { ...data, image: data.image.name };
        }
        catch {
            data = { ...data };
        }
        formData.append("recipe", JSON.stringify(data));

        updateRecipe.mutate({ recipe_id: recipeId, data: formData }, {
            onError: (error) => toast.error(error?.description),
            onSuccess: async () => {
                toast.success("Recipe modified successfully");
                await navigate({ to: `/details/${recipeId}`, replace: true });
            },
        });
    };

    return (
        <PageTitle title="Edit the Recipe" subtitle="Edit the recipe using the following form">
            <RecipeForm
                type={"Edition"}
                onSubmit={onSubmit}
                labels={recipe.labels}
                initValues={initValues}
                pendingState={updateRecipe.isPending}
            />
        </PageTitle>
    );
}
