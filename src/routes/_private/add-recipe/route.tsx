import {toast} from "sonner";
import {useTranslation} from "react-i18next";
import {useAddRecipe} from "~/lib/react-query";
import {useSuspenseQuery} from "@tanstack/react-query";
import {PageTitle} from "~/lib/components/app/PageTitle";
import {RecipeFormValues} from "~/lib/server/utils/schemas";
import {addRecipeOptions} from "~/lib/react-query/queryOptions";
import {RecipeForm} from "~/lib/components/recipe-form/RecipeForm";
import {createFileRoute, useNavigate} from "@tanstack/react-router";


export const Route = createFileRoute("/_private/add-recipe")({
    loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(addRecipeOptions),
    component: AddRecipePage,
});


function AddRecipePage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const addRecipe = useAddRecipe();
    const { data: labels } = useSuspenseQuery(addRecipeOptions);
    const initValues: RecipeFormValues = {
        title: "",
        labels: [],
        servings: 2,
        cooking: 30,
        comment: "",
        preparation: 30,
        steps: [{ content: "" }],
        ingredients: [{ quantity: 0, description: "" }],
    };

    const onSubmit = async (submittedData: RecipeFormValues) => {
        const formData = new FormData();

        formData.append("recipe", JSON.stringify(submittedData));
        if (submittedData.image) {
            formData.append("image", submittedData.image);
        }

        addRecipe.mutate({ data: formData }, {
            onSuccess: () => {
                toast.success("Recipe Successfully edited");
                return navigate({ to: "/dashboard" });
            }
        });
    };

    return (
        <PageTitle title={t("add-recipe")} subtitle={t("ar-subtitle")}>
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
