import {useState} from "react";
import {Search} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {useTranslation} from "react-i18next";
import {queryKeys} from "@famiglia-recipes/api";
import {Separator} from "@/components/ui/separator";
import {PageTitle} from "@/components/app/PageTitle";
import {MutedText} from "@/components/app/MutedText";
import {createFileRoute, Link} from "@tanstack/react-router";
import {groupRecipesAlphabetically, normalizeStr} from "@/lib/utils";
import {useQueryClient, useSuspenseQuery} from "@tanstack/react-query";
import {allRecipesOptions} from "@famiglia-recipes/api/src/queryOptions";


// noinspection JSCheckFunctionSignatures,JSUnusedGlobalSymbols
export const Route = createFileRoute("/_private/all-recipes")({
    loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(allRecipesOptions()),
    component: AllRecipesPage,
});


function AllRecipesPage() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [query, setQuery] = useState("");
    const apiData = useSuspenseQuery(allRecipesOptions()).data;
    const [selectedLabels, setSelectedLabels] = useState([]);

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
            queryClient.setQueryData(queryKeys.allRecipesKey(), (oldData) => ({ ...oldData, labels: newLabels }));
            setSelectedLabels([...selectedLabels, clickedLabel]);
        }
        else {
            const newLabels = [...apiData.labels, clickedLabel].sort((a, b) => a.order - b.order);
            queryClient.setQueryData(queryKeys.allRecipesKey(), (oldData) => ({ ...oldData, labels: newLabels }));
            setSelectedLabels(selectedLabels.filter(label => label.name !== clickedLabel.name));
        }
    };

    const sortedRecipes = groupRecipesAlphabetically(filteredRecipes);

    return (
        <PageTitle title={t("all-recipes", { count: apiData.recipes.length })} subtitle={t("all-recipes-subtitle")}>
            <div className="mt-6 space-y-4">
                <div>
                    <div className="rounded-md border border-neutral-500 w-[320px] max-sm:w-full">
                        <div className="flex items-center pl-2.5 max-sm:w-full">
                            <Search className="h-4 w-4 text-neutral-500"/>
                            <Input
                                value={query}
                                placeholder={t("search-recipes")}
                                onChange={(ev) => setQuery(ev.target.value)}
                                className={"border-none focus-visible:ring-0"}
                            />
                        </div>
                    </div>
                </div>
                <div className="max-w-[800px]">
                    <div className="text-lg font-semibold mb-1">{t("available-labels")}</div>
                    <div className="flex flex-wrap items-center gap-2">
                        {apiData.labels.map(label =>
                            <Badge key={label.id} color={label.color} onClick={() => labelClicked(label, true)}
                                   className="cursor-pointer rounded-full">
                                {label.name}
                            </Badge>
                        )}
                    </div>
                    <div className="text-lg font-semibold mb-1 mt-6">{t("selected-labels")}</div>
                    <div className="flex flex-wrap items-center gap-2">
                        {selectedLabels.length === 0 ?
                            <MutedText>{t("s-no-labels")}</MutedText>
                            :
                            selectedLabels.map(label =>
                                <Badge key={label.id} color={label.color} onClick={() => labelClicked(label, false)}
                                       className="cursor-pointer rounded-full">
                                    {label.name}
                                </Badge>
                            )}
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
                                            <Badge
                                                key={label.id}
                                                className="ml-1"
                                                color={label.color}
                                            />
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
}