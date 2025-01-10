import {toast} from "sonner";
import {cn} from "@/lib/utils";
import {useEffect, useState} from "react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {PageTitle} from "@/components/app/PageTitle";
import {Card, CardContent} from "@/components/ui/card";
import {CommentSection} from "@/components/details/CommentSection";
import {useQueryClient, useSuspenseQuery} from "@tanstack/react-query";
import {queryKeys, useAuth, useMutations} from "@famiglia-recipes/api";
import {createFileRoute, Link, useNavigate} from "@tanstack/react-router";
import {recipeDetailsOptions} from "@famiglia-recipes/api/src/queryOptions";
import {ChefHat, CircleCheck, Clock, Heart, History, Minus, Pen, Plus, Trash2, Users} from "lucide-react";


// noinspection JSCheckFunctionSignatures,JSUnusedGlobalSymbols
export const Route = createFileRoute("/_private/details/$recipeId")({
    loader: ({ context: { queryClient }, params: { recipeId } }) => queryClient.ensureQueryData(recipeDetailsOptions(recipeId)),
    component: RecipeDetailsPage,
});


function RecipeDetailsPage() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const queryClient = useQueryClient();
    const { recipeId } = Route.useParams();
    const [multi, setMulti] = useState(1);
    const { deleteRecipe, updateFavorite } = useMutations();
    const { data: recipe } = useSuspenseQuery(recipeDetailsOptions(recipeId));

    const onDeleteRecipe = async () => {
        if (!window.confirm("Do you really want to delete this recipe?")) return;

        deleteRecipe.mutate({ recipe_id: recipeId }, {
            onError: (error) => toast.error(error?.description),
            onSuccess: async () => {
                toast.success("Recipe successfully deleted!");
                await navigate({ to: "/dashboard", replace: true });
            },
        });
    };

    const handleUpdateFavorite = () => {
        updateFavorite.mutate({ recipe_id: recipeId }, {
            onError: (error) => toast.error(error?.description),
            onSuccess: () => {
                queryClient.setQueryData(queryKeys.recipeDetailsKey(recipeId), (oldData) => {
                    toast.success((oldData.is_favorited ? "Removed from your favorites" : "Added to your favorites"));
                    return { ...oldData, is_favorited: !oldData.is_favorited };
                });
            },
        });
    };

    return (
        <PageTitle title={`${recipe.title}`} onlyHelmet>
            <div className="flex max-sm:flex-col max-w-6xl mx-auto mt-8 gap-8 max-lg:gap-5">
                <div className="w-2/3 max-sm:w-full max-lg:w-[65%]">
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold tracking-tight">
                            {recipe.title}
                            <div className="text-muted-foreground text-sm mt-2 font-normal">
                                Added by <b>{recipe.submitter.username}</b> the {recipe.submitted_date}
                            </div>
                        </h1>
                        <div className="flex gap-3">
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleUpdateFavorite} disabled={updateFavorite.isPending}>
                                <Heart className={cn("h-4 w-4", recipe.is_favorited && "text-red-600")}/>
                            </Button>
                            <Link to={`/edit-recipe/${recipeId}`}>
                                <Button variant="outline" size="icon" className="h-8 w-8">
                                    <Pen className="h-4 w-4"/>
                                </Button>
                            </Link>
                            {currentUser.role === "user" &&
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={onDeleteRecipe}>
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            }
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {recipe.labels.map(label =>
                                <Badge key={label.name} variant="inactive" color={label.color}>
                                    {label.name}
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center justify-between max-sm:flex-wrap max-sm:gap-5">
                            <div className="flex items-center justify-between gap-3">
                                <Clock className="w-6 h-6 text-amber-600"/>
                                <div>
                                    <div className="font-semibold">Prep.</div>
                                    <div>{recipe.prep_time} min</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <ChefHat className="w-6 h-6 text-amber-600"/>
                                <div>
                                    <div className="font-semibold">Cooking</div>
                                    <div>{recipe.cooking_time} min</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <History className="w-6 h-6 text-amber-600"/>
                                <div>
                                    <div className="font-semibold">Total</div>
                                    <div>{recipe.prep_time + recipe.cooking_time} min</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <Users className="w-6 h-6 text-amber-600"/>
                                <div>
                                    <div className="font-semibold">Servings</div>
                                    <Servings
                                        multiSetter={setMulti}
                                        initServings={recipe.servings}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Separator className="my-7"/>
                    <div>
                        <h2 className="text-2xl font-semibold mb-6 tracking-tight">Instructions</h2>
                        <ol className="space-y-4">
                            {recipe.steps.map((step, idx) =>
                                <li key={idx}>
                                    <div className="grid grid-cols-[80px_1fr] text-lg">
                                        <div className="flex items-center font-semibold text-cyan-500">Step {idx + 1}</div>
                                        <div>{step.description}</div>
                                    </div>
                                    <Separator className="mt-4"/>
                                </li>
                            )}
                        </ol>
                    </div>
                    <div className="mt-9">
                        <CommentSection
                            recipeId={recipe.id}
                            currentUserId={currentUser.id}
                            recipeSubmitterId={recipe.submitter_id}
                        />
                    </div>
                </div>
                <div className="w-1/3 max-sm:w-full max-lg:w-[35%]">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <img
                            alt={recipe.title}
                            src={recipe.cover_image}
                            className="object-cover rounded-lg bg-slate-700"
                        />
                    </div>
                    <Card className="sticky top-24 mt-8">
                        <CardContent className="pt-3">
                            <h2 className="text-2xl font-semibold tracking-tight mb-6">Ingredients</h2>
                            <ul className="space-y-3 text-lg">
                                {recipe.ingredients.map(data =>
                                    <li key={data.ingredient} className="flex items-start">
                                        <CircleCheck className="w-4 h-4 mr-4 mt-1 flex-shrink-0 text-green-600"/>
                                        <span>{parseFloat((data.proportion * multi).toFixed(1))} {data.ingredient}</span>
                                    </li>
                                )}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageTitle>
    );
}


const Servings = ({ initServings, multiSetter }) => {
    const [servings, setServings] = useState(initServings);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        setServings(initServings);
    }, [initServings]);

    const updateServings = (action) => {
        let newServing = initServings;

        if (action === "add") {
            newServing = servings + 1;
            setDisabled(false);
        }

        if (action === "remove") {
            newServing = servings - 1;
            if (newServing === 1) {
                setDisabled(true);
            }
        }

        setServings(newServing);
        multiSetter(newServing / initServings);
    };

    return (
        <div className="flex items-center justify-around gap-2">
            {disabled ?
                <Minus className="w-4 h-4"/>
                :
                <div role="button" onClick={() => updateServings("remove")}>
                    <Minus className="w-4 h-4 hover:opacity-70"/>
                </div>
            }
            {servings} pers.
            <div role="button" onClick={() => updateServings("add")}>
                <Plus className="w-4 h-4 hover:opacity-70"/>
            </div>
        </div>
    );
};
