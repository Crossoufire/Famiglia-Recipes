import {useState} from "react";
import {Search} from "lucide-react";
import {useTranslation} from "react-i18next";
import {Input} from "~/lib/components/ui/input";
import {Badge} from "~/lib/components/ui/badge";
import {allRecipesOptions} from "~/lib/react-query";
import {useSuspenseQuery} from "@tanstack/react-query";
import {Separator} from "~/lib/components/ui/separator";
import {PageTitle} from "~/lib/components/app/PageTitle";
import {MutedText} from "~/lib/components/app/MutedText";
import {createFileRoute, Link} from "@tanstack/react-router";
import {groupRecipesAlphabetically, normalizeStr} from "~/lib/utils/helpers";


export type ApiData = Awaited<ReturnType<NonNullable<ReturnType<typeof allRecipesOptions>["queryFn"]>>>;
type RecipeLabel = Awaited<ReturnType<NonNullable<ReturnType<typeof allRecipesOptions>["queryFn"]>>>["labels"][0];


export const Route = createFileRoute("/_private/all-recipes")({
    loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(allRecipesOptions()),
    component: AllRecipesPage,
});


function AllRecipesPage() {
    const { t } = useTranslation();
    const [query, setQuery] = useState("");
    const apiData = useSuspenseQuery(allRecipesOptions()).data;
    const [selectedLabels, setSelectedLabels] = useState<RecipeLabel[]>([]);
    const availableLabels = apiData.labels.filter((label) => !selectedLabels.some(sl => sl.id === label.id));

    const filteredRecipes = apiData.recipes.filter((recipe) => {
        const matchesQuery = normalizeStr(recipe.title).includes(normalizeStr(query));

        const matchesLabels = (selectedLabels.length === 0) || selectedLabels.every((label) =>
            recipe.recipeLabels.some((value) => value.label.name === label.name)
        );

        return matchesQuery && matchesLabels;
    });

    const labelClicked = async (clickedLabel: RecipeLabel) => {
        const isSelected = selectedLabels.some((label) => label.id === clickedLabel.id);

        if (isSelected) {
            setSelectedLabels(currentLabels => currentLabels.filter(label => label.id !== clickedLabel.id));
        }
        else {
            setSelectedLabels(currentLabels => [...currentLabels, clickedLabel]);
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
                                className={"border-none focus-visible:ring-0"}
                                onChange={(ev) => setQuery(ev.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="max-w-[800px]">
                    <div className="text-lg font-semibold mb-1">{t("available-labels")}</div>
                    <div className="flex flex-wrap items-center gap-2">
                        {availableLabels.map((label) =>
                            <Badge
                                key={label.id}
                                color={label.color}
                                className="cursor-pointer rounded-full"
                                onClick={() => labelClicked(label)}
                            >
                                {label.name}
                            </Badge>
                        )}
                    </div>
                    <div className="text-lg font-semibold mb-1 mt-6">{t("selected-labels")}</div>
                    <div className="flex flex-wrap items-center gap-2">
                        {selectedLabels.length === 0 ?
                            <MutedText>{t("s-no-labels")}</MutedText>
                            :
                            selectedLabels.map((label) =>
                                <Badge
                                    key={label.id}
                                    color={label.color}
                                    className="cursor-pointer rounded-full"
                                    onClick={() => labelClicked(label)}
                                >
                                    {label.name}
                                </Badge>
                            )}
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-7">
                    {Object.keys(sortedRecipes).sort().map((letter) =>
                        <div key={letter}>
                            <h2 className="text-3xl">{letter} <Separator/></h2>
                            <ul>
                                {sortedRecipes[letter].map((recipe) =>
                                    <li key={recipe.id} className="ml-5 list-disc mb-1">
                                        <Link to="/details/$recipeId" params={{ recipeId: recipe.id.toString() }} className="mr-1">
                                            {recipe.title}
                                        </Link>
                                        {recipe.recipeLabels.map((label) =>
                                            <Badge
                                                className={"ml-1"}
                                                key={label.labelId}
                                                color={label.label.color}
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
