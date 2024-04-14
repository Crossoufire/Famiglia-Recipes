import {toast} from "sonner";
import {useState} from "react";
import {LuSearch} from "react-icons/lu";
import {Input} from "@/components/ui/input";
import {ErrorPage} from "@/pages/ErrorPage";
import {Button} from "@/components/ui/button";
import {useApi} from "@/providers/ApiProvider";
import {useFetchData} from "@/hooks/FetchDataHook";
import {Separator} from "@/components/ui/separator";
import {PageTitle} from "@/components/app/PageTitle";
import {RecipeCard} from "@/components/app/RecipeCard";
import {Loading} from "@/components/app/Loading.jsx";
import MultipleSelector from "@/components/ui/multiple-selector";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";


export const SearchRecipePage = () => {
    const api = useApi();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [selectedLabels, setSelectedLabels] = useState([]);
    const { apiData, loading, error } = useFetchData("/labels");

    const searchRecipes = async () => {
        if (!query || query.trim() === "") {
            return;
        }

        setLoading(true);
        const response = await api.get("/search_recipes", {
            q: query,
        });
        setLoading(false);

        if (!response.ok) {
            return toast.error(response.body.description);
        }

        setResults(response.body.data);
        if (response.body.data.length === 0) {
            return toast.warning("Sorry, no recipe found.")
        }
    };

    const onButtonSearch = () => {
        void searchRecipes();
    };

    const onKeyPress = (ev) => {
        if (ev.key !== "Enter") {
            return;
        }
        void searchRecipes();
    }

    const searchRecipesLabels = async () => {
        if (selectedLabels.length === 0) {
            return;
        }

        setLoading(true);
        const response = await api.get("/search_recipes/labels", {
            labels: JSON.stringify(selectedLabels),
        });
        setLoading(false);

        if (!response.ok) {
            return toast.error(response.body.description);
        }

        setResults(response.body.data);
        if (response.body.data.length === 0) {
            return toast.warning("Sorry, no recipe found")
        }
    };

    const onLabelSearch = () => {
        void searchRecipesLabels();
    };

    if (error) return <ErrorPage {...error}/>;
    if (loading) return <Loading/>;

    return (
        <PageTitle title="Search Recipe" subtitle="Search a recipe per title/ingredients or labels">
            <Tabs defaultValue="ingredients" className="w-[400px] mt-6 max-sm:w-full">
                <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="ingredients">Title/Ingredients</TabsTrigger>
                    <TabsTrigger value="label">Labels</TabsTrigger>
                </TabsList>
                <TabsContent value="ingredients">
                    <div className="flex justify-between gap-4 mt-6 flex-wrap max-sm:justify-center">
                        <div className="flex items-center gap-4 max-sm:w-full">
                            <div className="rounded-md border border-neutral-500 max-sm:w-full">
                                <div className="flex items-center pl-2.5 w-96 max-sm:w-full">
                                    <LuSearch size={18}/>
                                    <Input
                                        value={query}
                                        onKeyPress={onKeyPress}
                                        onChange={(ev) => setQuery(ev.target.value)}
                                        placeholder="Search by title/ingredients..."
                                        className="border-none focus-visible:ring-0"
                                    />
                                </div>
                            </div>
                            <Button onClick={onButtonSearch} disabled={query.length === 0}>
                                Search
                            </Button>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="label">
                    <div className="flex items-center gap-3 mt-6 h-12">
                        <MultipleSelector
                            onChange={(labels) => setSelectedLabels(labels)}
                            defaultOptions={apiData}
                            placeholder="Select labels..."
                            maxSelected={5}
                        />
                        <Button onClick={onLabelSearch} disabled={selectedLabels.length === 0 && true}>
                            Search
                        </Button>
                    </div>

                </TabsContent>
            </Tabs>
            <Separator className="mt-8"/>
            <div className="grid grid-cols-12 gap-4 mt-6">
                {isLoading ?
                    <Loading forPage={false}/>
                    :
                    results.map(recipe =>
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                        />
                    )}
            </div>
        </PageTitle>
    );
};
