import {toast} from "sonner";
import {useTranslation} from "react-i18next";
import {useSuspenseQuery} from "@tanstack/react-query";
import {PageTitle} from "~/lib/components/app/PageTitle";
import {RecipeFormValues} from "~/lib/server/utils/schemas";
import {RecipeForm} from "~/lib/components/recipe-form/RecipeForm";
import {createFileRoute, useNavigate} from "@tanstack/react-router";
import {editRecipeOptions, useUpdateRecipe} from "~/lib/react-query";


export const Route = createFileRoute("/_private/edit-recipe/$recipeId")({
    loader: ({ context: { queryClient }, params: { recipeId } }) =>
        queryClient.ensureQueryData(editRecipeOptions(parseInt(recipeId))),
    component: EditRecipePage,
})


function EditRecipePage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { recipeId } = Route.useParams();
    const updateRecipeMutation = useUpdateRecipe();
    const apiData = useSuspenseQuery(editRecipeOptions(parseInt(recipeId))).data;
    const initValues: RecipeFormValues = {
        title: apiData.recipe.title,
        servings: apiData.recipe.servings,
        cooking: apiData.recipe.cookingTime,
        preparation: apiData.recipe.prepTime,
        comment: apiData.recipe.comment || "",
        labels: apiData.recipe.recipeLabels.map(ing => ing.name),
        steps: apiData.recipe.steps.map(ing => ({ content: ing.description })),
        ingredients: apiData.recipe.ingredients.map(ing => ({ quantity: ing.proportion, description: ing.ingredient })),
    };

    const onSubmit = async (submittedData: RecipeFormValues) => {
        const formData = new FormData();

        formData.append("recipe", JSON.stringify({ id: recipeId, ...submittedData }));
        if (submittedData.image) {
            formData.append("image", submittedData.image);
        }

        updateRecipeMutation.mutate({ formData: formData }, {
            onSuccess: () => {
                toast.success("Recipe Successfully edited");
                return navigate({ to: "/details/$recipeId", params: { recipeId }, replace: true });
            }
        });
    };

    return (
        <PageTitle title={t("edit-recipe")} subtitle={t("edit-recipe-subtitle")}>
            <RecipeForm
                type={"Edit"}
                onSubmit={onSubmit}
                labels={apiData.labels}
                initValues={initValues}
                pendingState={updateRecipeMutation.isPending}
            />
        </PageTitle>
    );
}
