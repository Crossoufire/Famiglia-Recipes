import {useState} from "react";
import {Link} from "react-router-dom";
import {LuSearch} from "react-icons/lu";
import {Badge} from "@/components/ui/badge";
import {Input} from "@/components/ui/input";
import {ErrorPage} from "@/pages/ErrorPage";
import {Loading} from "@/components/app/Loading";
import {useFetchData} from "@/hooks/FetchDataHook";
import {Separator} from "@/components/ui/separator";
import {PageTitle} from "@/components/app/PageTitle";
import {groupRecipesAlphabetically, normalizeStr} from "@/lib/utils";


export const AllRecipesPage = () => {
    const [query, setQuery] = useState("");
    const [selectedLabels, setSelectedLabels] = useState([]);
    const { apiData, mutate, loading, error } = useFetchData("/all_recipes");

    if (error) return <ErrorPage {...error}/>;
    if (loading) return <Loading/>;

    const filteredRecipes = apiData.recipes.filter(recipe => {
        const matchesQuery = normalizeStr(recipe.title).includes(normalizeStr(query));
        const matchesLabels = (selectedLabels.length === 0) || selectedLabels.every(label =>
            recipe.labels.some(value => value.name === label.name)
        );
        return matchesQuery && matchesLabels;
    });

    const labelClicked = async (clickedLabel, isSelected) => {
        if (isSelected) {
            const newLabels = apiData.labels.filter(label => label.name !== clickedLabel.name);
            await mutate({ ...apiData, labels: newLabels }, false);
            setSelectedLabels([...selectedLabels, clickedLabel]);
        }
        else {
            const newLabels = [...apiData.labels, clickedLabel].sort((a, b) => a.order - b.order);
            await mutate({ ...apiData, labels: newLabels }, false);
            setSelectedLabels(selectedLabels.filter(label => label.name !== clickedLabel.name));
        }
    };

    const sortedRecipes = groupRecipesAlphabetically(filteredRecipes);

    return (
        <PageTitle title={`All Recipes (${apiData.recipes.length})`} subtitle="All recipes sorted alphabetically">
            <div className="mt-6 space-y-4">
                <div>
                    <div className="rounded-md border border-neutral-500 w-[320px] max-sm:w-full">
                        <div className="flex items-center pl-2.5 max-sm:w-full">
                            <LuSearch size={18}/>
                            <Input
                                value={query}
                                placeholder={"Search by Title"}
                                onChange={(ev) => setQuery(ev.target.value)}
                                className={"border-none focus-visible:ring-0"}
                            />
                        </div>
                    </div>
                </div>
                <div className="max-w-[800px]">
                    <div className="text-lg font-semibold mb-1">Available Labels</div>
                    <div className="flex flex-wrap items-center gap-2">
                        {apiData.labels.map(label =>
                            <Badge key={label.id} color={label.color} onClick={() => labelClicked(label, true)}
                                   className="cursor-pointer">
                                {label.name}
                            </Badge>
                        )}
                    </div>
                    <div className="text-lg font-semibold mb-1 mt-6">Selected Labels</div>
                    <div className="flex flex-wrap items-center gap-2">
                        {selectedLabels.length === 0 ?
                            <i className="text-muted-foreground">No selected labels added for filtering</i>
                            :
                            selectedLabels.map(label =>
                                <Badge key={label.id} color={label.color} onClick={() => labelClicked(label, false)}
                                       className="cursor-pointer">
                                    {label.name}
                                </Badge>
                            )
                        }
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-7">
                    {Object.keys(sortedRecipes).sort().map(letter =>
                        <div key={letter}>
                            <h2 className="text-3xl">{letter} <Separator/></h2>
                            <ul>
                                {sortedRecipes[letter].map(recipe =>
                                    <li key={recipe.id} className="ml-5 list-disc mb-1">
                                        <Link to={`/details/${recipe.id}`} className="mr-1">
                                            {recipe.title}
                                        </Link>
                                        {recipe.labels.map(label =>
                                            <Badge key={label.id} color={label.color} className="ml-1"/>
                                        )}
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </PageTitle>
    );
};