import {ErrorPage} from "@/pages/ErrorPage";
import {useFetchData} from "@/hooks/FetchDataHook";
import {Separator} from "@/components/ui/separator";
import {PageTitle} from "@/components/app/PageTitle";
import {RecipeCard} from "@/components/app/RecipeCard";
import {Loading} from "@/components/app/Loading.jsx";


export const DashboardPage = () => {
    const { apiData, loading, error } = useFetchData("/dashboard");

    if (error) return <ErrorPage {...error}/>;
    if (loading) return <Loading/>;

    return (
        <PageTitle title="Your Dashboard" subtitle="here are your favorite recipes as well as the last added one">
            <section className="last recipes mt-9">
                <h2 className="text-xl font-medium">Your Favorite Recipes</h2>
                <Separator className="mt-1 mb-4"/>
                {apiData.favorite_recipes.length === 0 ?
                    <i className="text-muted-foreground">No favorite recipes added yet</i>
                    :
                    <div className="grid grid-cols-12 gap-4">
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
                    <i className="text-muted-foreground">No last recipes added yet</i>
                    :
                    <div className="grid grid-cols-12 gap-4">
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
};
