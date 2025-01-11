import {useTranslation} from "react-i18next";
import {Separator} from "@/components/ui/separator";
import {PageTitle} from "@/components/app/PageTitle";
import {MutedText} from "@/components/app/MutedText";
import {RecipeCard} from "@/components/app/RecipeCard";
import {createFileRoute} from "@tanstack/react-router";
import {useSuspenseQuery} from "@tanstack/react-query";
import {dashboardOptions} from "@famiglia-recipes/api/src/queryOptions";


// noinspection JSCheckFunctionSignatures,JSUnusedGlobalSymbols
export const Route = createFileRoute("/_private/dashboard")({
    loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(dashboardOptions()),
    component: DashboardPage,
});


function DashboardPage() {
    const { t } = useTranslation();
    const apiData = useSuspenseQuery(dashboardOptions()).data;

    return (
        <PageTitle title={t("da-title")} subtitle={t("da-subtitle")}>
            <section className="last recipes mt-9">
                <h2 className="text-xl font-medium">
                    {t("fav-recipes")}
                </h2>
                <Separator className="mt-1 mb-4"/>
                {apiData.favorite_recipes.length === 0 ?
                    <MutedText>{t("no-fav-recipes")}</MutedText>
                    :
                    <div className="grid max-sm:grid-cols-1 max-lg:grid-cols-3 grid-cols-4 gap-6 max-lg:gap-4">
                        {apiData.favorite_recipes.map(recipe =>
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                            />
                        )}
                    </div>
                }
            </section>
            <section className="random recipes mt-9">
                <h2 className="text-xl font-medium">{t("last-recipes")}</h2>
                <Separator className="mt-1 mb-4"/>
                {apiData.last_recipes.length === 0 ?
                    <MutedText>{t("no-last-recipes")}</MutedText>
                    :
                    <div className="grid max-sm:grid-cols-1 max-lg:grid-cols-3 grid-cols-4 gap-6 max-lg:gap-4">
                        {apiData.last_recipes.map(recipe =>
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                            />
                        )}
                    </div>
                }
            </section>
        </PageTitle>
    );
}