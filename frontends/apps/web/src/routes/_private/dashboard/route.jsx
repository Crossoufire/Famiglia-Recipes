import {PageTitle} from "@/components/app/PageTitle";
import {MutedText} from "@/components/app/MutedText";
import {RecipeCard} from "@/components/app/RecipeCard";
import {Separator} from "@/components/ui/separator";
import {createFileRoute} from "@tanstack/react-router";
import {useSuspenseQuery} from "@tanstack/react-query";
import {dashboardOptions} from "@famiglia-recipes/api/src/queryOptions";


// noinspection JSCheckFunctionSignatures,JSUnusedGlobalSymbols
export const Route = createFileRoute("/_private/dashboard")({
    loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(dashboardOptions()),
    component: DashboardPage,
});


function DashboardPage() {
    const apiData = useSuspenseQuery(dashboardOptions()).data;

    return (
        <PageTitle title="Your Dashboard" subtitle="here are your favorite recipes as well as the last added one">
            <section className="last recipes mt-9">
                <h2 className="text-xl font-medium">Your Favorite Recipes</h2>
                <Separator className="mt-1 mb-4"/>
                {apiData.favorite_recipes.length === 0 ?
                    <MutedText>No favorite recipes added yet</MutedText>
                    :
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                <h2 className="text-xl font-medium">Last recipes added</h2>
                <Separator className="mt-1 mb-4"/>
                {apiData.last_recipes.length === 0 ?
                    <MutedText>No last recipes added yet</MutedText>
                    :
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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