import {useState} from "react";
import {useRouter} from "expo-router";
import {Search} from "lucide-react-native";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {allRecipesOptions, queryKeys} from "@famiglia-recipes/api";
import {groupRecipesAlphabetically, normalizeStr} from "famiglia-recipes/src/lib/utils";
import {Pressable, RefreshControl, ScrollView, SectionList, Text, TextInput, TouchableOpacity, View} from "react-native";


export default function AllRecipesScreen() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [query, setQuery] = useState("");
    const [selectedLabels, setSelectedLabels] = useState([]);
    const { data: apiData, isLoading, error, isRefetching, refetch } = useQuery(allRecipesOptions());

    if (isLoading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error?.description}</Text>;

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

    const sections = Object.keys(sortedRecipes).sort().map(letter => ({
        title: letter,
        data: sortedRecipes[letter],
    }));

    return (
        <ScrollView className="mt-8 mb-8" refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch}/>}>
            <View className="flex flex-col gap-6">
                <View className="rounded-md border border-neutral-500 w-full">
                    <View className="flex flex-row items-center pl-2.5 w-full">
                        <Search color="#737373" size={20}/>
                        <TextInput
                            value={query}
                            onChangeText={setQuery}
                            placeholderTextColor="#737373"
                            placeholder="Search by Recipe Title"
                            className="w-full ml-3 text-white"
                        />
                    </View>
                </View>
                <View className="w-full">
                    <View>
                        <Text className="text-lg font-semibold mb-1 text-white">
                            Available Labels
                        </Text>
                        <View className="flex flex-row flex-wrap items-center gap-2">
                            {apiData.labels.map(label =>
                                <Pressable key={label.id} className="p-2 rounded-full text-white"
                                           onPress={() => labelClicked(label, true)} style={{ backgroundColor: label.color }}>
                                    <Text>{label.name}</Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                    <View>
                        <Text className="text-lg font-semibold mb-1 mt-6 text-white">
                            Selected Labels
                        </Text>
                        <View className="flex flex-row flex-wrap items-center gap-2">
                            {selectedLabels.length === 0 ?
                                <Text className="text-neutral-500 italic">No selected labels added for filtering</Text>
                                :
                                selectedLabels.map(label =>
                                    <Pressable key={label.id} className="p-2 rounded-full text-white"
                                               onPress={() => labelClicked(label, false)} style={{ backgroundColor: label.color }}>
                                        <Text>{label.name}</Text>
                                    </Pressable>
                                )}
                        </View>
                    </View>
                </View>
            </View>
            <SectionList
                className="mt-6"
                sections={sections}
                keyExtractor={item => `section-${item.id}`}
                renderSectionHeader={({ section }) => (
                    <Text className="text-2xl font-semibold text-neutral-400 ml-2 mt-4">
                        {section.title}
                    </Text>
                )}
                renderItem={({ item: recipe }) => (
                    <View key={`badge-view-${recipe.id}`} className="ml-2 mb-1">
                        <TouchableOpacity onPress={() => router.navigate(`details/${recipe.id}`)}>
                            <Text className="text-lg text-white">
                                {recipe.title}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </ScrollView>
    );
}
