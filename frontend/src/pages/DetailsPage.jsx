import {toast} from "sonner";
import {useState} from "react";
import {Badge} from "@/components/ui/badge";
import {ErrorPage} from "@/pages/ErrorPage";
import {Button} from "@/components/ui/button";
import {useApi} from "@/providers/ApiProvider";
import {Tooltip} from "@/components/ui/tooltip";
import {FaRegPenToSquare} from "react-icons/fa6";
import {Loading} from "@/components/app/Loading";
import {useUser} from "@/providers/UserProvider";
import {useFetchData} from "@/hooks/FetchDataHook";
import {Separator} from "@/components/ui/separator";
import {PageTitle} from "@/components/app/PageTitle";
import {Link, useNavigate, useParams} from "react-router-dom";
import {FaMinus, FaPlus, FaRegStar, FaRegTrashAlt} from "react-icons/fa";


export const DetailsPage = () => {
    const api = useApi();
    const navigate = useNavigate();
    const { recipeId } = useParams();
    const { currentUser } = useUser();
    const [multi, setMulti] = useState(1);
    const { apiData, loading, error } = useFetchData(`/details/${recipeId}`);

    const onDeleteRecipe = async () => {
        if (!window.confirm("Do you really want to delete this recipe?")) return;

        const response = await api.post(`/delete_recipe`, { recipe_id: recipeId });
        if (!response.ok) {
            return toast.error(response.body.description);
        }

        toast.success("Recipe successfully deleted!");
        navigate("/dashboard", { replace: true });
    };

    if (error) return <ErrorPage {...error}/>;
    if (loading) return <Loading/>;

    return (
        <PageTitle title={`${apiData.title}`} onlyHelmet>
            <div className="max-w-[1000px] mx-auto">
                <div>
                    <h3 className="text-2xl font-semibold flex justify-between items-center mt-8">
                        <div className="flex items-center gap-4">
                            {apiData.title}
                        </div>
                        <div className="flex items-center gap-4">
                            <Tooltip text="Edit recipe" side="left">
                                <Link to={`/edit_recipe/${recipeId}`} className="opacity-40 hover:opacity-100">
                                    <FaRegPenToSquare size={18}/>
                                </Link>
                            </Tooltip>
                            {currentUser.role !== "user" &&
                                <Tooltip text="Delete recipe" side="bottom">
                                    <div role="button" className="opacity-40 hover:opacity-100 hover:text-destructive"
                                    onClick={onDeleteRecipe}>
                                        <FaRegTrashAlt size={18} color="desctructive"/>
                                    </div>
                                </Tooltip>
                            }
                        </div>
                    </h3>
                    <Separator className="mt-1 mb-4"/>
                </div>
                <div className="grid grid-cols-12 gap-y-10">
                    <div className="col-span-12 md:col-span-5 lg:col-span-4">
                        <div className="flex flex-col items-center sm:items-start gap-4">
                            {apiData.cover_image &&
                                <img
                                    alt="recipe-image"
                                    src={apiData.cover_image}
                                    className="w-[300px] h-[300px] rounded-md"
                                />
                            }
                            <div className="flex items-center gap-2">
                                {apiData.labels.map(label =>
                                    <Badge key={label.name} size="sm" variant="inactive" color={label.color}>
                                        {label.name}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-7 lg:col-span-8">
                        <div className="flex items-center justify-between flex-wrap max-sm:justify-center gap-3">
                            <div className="flex items-center gap-3">
                                <UpdateFavorite
                                    recipeId={recipeId}
                                    isFavorited={apiData.is_favorited}
                                />
                                <Servings
                                    multiSetter={setMulti}
                                    initServings={apiData.servings}
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant="secondary" size="xl" className="hover:bg-secondary">
                                    Cuisson: {apiData.cooking_time} min
                                </Badge>
                                <Badge variant="secondary" size="xl" className="hover:bg-secondary">
                                    Prep. time: {apiData.prep_time} min
                                </Badge>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl mt-8 font-medium">Ingredients</h3>
                            <Separator className="mt-1 mb-4"/>
                            <ul className="mt-4 list-disc ml-5">
                                {apiData.ingredients.map(data =>
                                    <li key={data.ingredient}>
                                        {parseFloat((data.proportion * multi).toFixed(1))} {data.ingredient}
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl mt-8 font-medium">Steps</h3>
                            <Separator className="mt-1 mb-4"/>
                            <ul className="mt-4 list-disc ml-5">
                                {apiData.steps.map((step, idx) =>
                                    <li key={idx}>
                                        {step.description}
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl mt-8 font-medium">Comment</h3>
                            <Separator className="mt-1 mb-4"/>
                            <div>
                                {apiData.comment ?
                                    apiData.comment
                                    :
                                    <i className="text-muted-foreground">No comment for this recipe</i>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTitle>
    );
};


const UpdateFavorite = ({ recipeId, isFavorited }) => {
    const api = useApi();
    const [isFavorite, setIsFavorite] = useState(isFavorited);

    const updateFavorite = async () => {
        setIsFavorite(!isFavorite);

        const response = await api.post("/update_favorite", { recipe_id: recipeId });
        if (!response.ok) {
            setIsFavorite(isFavorite);
            return toast.error(response.body.description);
        }

        toast.success((!isFavorite ? "Added to your favorites" : "Removed from your favorites"));
    };

    return (
        <Tooltip text={isFavorite ? "Remove favorite" : "Add favorite"}>
            <Button variant="secondary" onClick={updateFavorite}>
                <FaRegStar size={20} className={isFavorite && "text-amber-500"}/>
            </Button>
        </Tooltip>
    );
};


const Servings = ({ initServings, multiSetter }) => {
    const [disabled, setDisabled] = useState(false);
    const [servings, setServings] = useState(initServings);

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
        <div>
            <Badge variant="secondary" size="xl" className="hover:bg-secondary flex gap-3">
                {disabled ?
                    <FaMinus/>
                    :
                    <div role="button" onClick={() => updateServings("remove")}>
                        <FaMinus className="hover:text-neutral-400"/>
                    </div>
                }
                Servings: {servings} pers.
                <div role="button" onClick={() => updateServings("add")}>
                    <FaPlus className="hover:text-neutral-400"/>
                </div>
            </Badge>
        </div>
    );
};
