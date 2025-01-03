import {useEffect, useState} from "react";
import {Loading} from "@/components/Loading";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {ChefHat, CircleCheck, Clock, History, Minus, Plus} from "lucide-react-native";
import {queryKeys, recipeDetailsOptions, useAuth, useMutations} from "@famiglia-recipes/api";
import {Image, Pressable, RefreshControl, ScrollView, Text, ToastAndroid, View} from "react-native";


export default function DetailsScreen() {
    const router = useRouter();
    const { currentUser } = useAuth();
    const queryClient = useQueryClient();
    const { recipeId } = useLocalSearchParams();
    const [multi, setMulti] = useState(1);
    const { deleteRecipe, updateFavorite } = useMutations();
    const { data: recipe, isLoading, error, isRefetching, refetch } = useQuery(recipeDetailsOptions(recipeId));

    if (isLoading) return <Loading/>;
    if (error) return <Text>Error: {error?.description}</Text>;

    const onDeleteRecipe = async () => {
        deleteRecipe.mutate({ recipe_id: recipeId }, {
            onError: (error) => ToastAndroid.show(error?.description, ToastAndroid.SHORT),
            onSuccess: () => {
                ToastAndroid.show("Recipe successfully deleted!", ToastAndroid.SHORT),
                    router.replace("/dashboard");
            },
        });
    };

    const handleUpdateFavorite = () => {
        updateFavorite.mutate({ recipe_id: recipeId }, {
            onError: (error) => ToastAndroid.show(error?.description, ToastAndroid.SHORT),
            onSuccess: () => {
                queryClient.setQueryData(queryKeys.recipeDetailsKey(recipeId), (oldData) => {
                    ToastAndroid.show(
                        (oldData.is_favorited ? "Removed from your favorites" : "Added to your favorites"),
                        ToastAndroid.SHORT,
                    );
                    return { ...oldData, is_favorited: !oldData.is_favorited };
                });
            },
        });
    };

    console.log(recipe);

    return (
        <ScrollView className="mt-6" refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch}/>}
                    style={{ paddingLeft: 10, paddingRight: 10 }}>
            <Image
                style={{ height: 300 }}
                className={"w-full mb-4"}
                source={{ uri: recipe.cover_image || "https://placehold.co/300x200" }}
            />
            <Text className="text-3xl text-white tracking-tight font-bold mb-4">
                {recipe.title}
            </Text>
            <View className="flex flex-row flex-wrap items-center justify-between mb-8">
                <View className="flex flex-row items-center justify-between gap-2">
                    <Clock size={20} color="#d97706"/>
                    <View>
                        <Text className="font-semibold text-white">Preparation</Text>
                        <Text className="text-white">{recipe.prep_time} min</Text>
                    </View>
                </View>
                <View className="flex flex-row items-center justify-between gap-2">
                    <ChefHat size={20} color="#d97706"/>
                    <View>
                        <Text className="font-semibold text-white">Cooking</Text>
                        <Text className="text-white">{recipe.cooking_time} min</Text>
                    </View>
                </View>
                <View className="flex flex-row items-center justify-between gap-2">
                    <History size={20} color="#d97706"/>
                    <View>
                        <Text className="font-semibold text-white">Total</Text>
                        <Text className="text-white">{recipe.prep_time + recipe.cooking_time} min</Text>
                    </View>
                </View>
            </View>
            <View className="flex flex-row items-center justify-between gap-4">
                <View>
                    <Text className="text-2xl font-bold text-white">
                        Ingredients for
                    </Text>
                    <Text className="text-lg text-white">
                        {recipe.servings} servings
                    </Text>
                </View>
                <View>
                    <Servings
                        multiSetter={setMulti}
                        initServings={recipe.servings}
                    />
                </View>
            </View>
            <View className="mt-4">
                <View className="flex flex-col gap-4">
                    {recipe.ingredients.map(data =>
                        <View key={data.ingredient} className="flex flex-row items-center gap-2">
                            <CircleCheck size={18} color="#16a34a" className="mr-4 mt-1 flex-shrink-0"/>
                            <Text className="text-white">
                                {parseFloat((data.proportion * multi).toFixed(1))} {data.ingredient}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
            <View className="mt-10 mb-10">
                <Text className="text-2xl font-semibold mb-4 tracking-tight text-white">
                    Instructions
                </Text>
                <View className="flex flex-col gap-4" style={{ paddingRight: 20 }}>
                    {recipe.steps.map((step, idx) =>
                        <View key={idx}>
                            <View className="flex flex-row items-start gap-4">
                                <Text className="flex items-center font-semibold text-lg" style={{ color: "#06b6d4" }}>
                                    {idx + 1}
                                </Text>
                                <Text className="text-white text-lg">
                                    {step.description}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}


const Servings = ({ initServings, multiSetter }) => {
    const [disabled, setDisabled] = useState(false);
    const [servings, setServings] = useState(initServings || 2);

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
        <View className="flex flex-row items-center justify-around gap-4">
            {disabled ?
                <Minus size={18} color="#d97706"/>
                :
                <Pressable onPress={() => updateServings("remove")}>
                    <Minus size={18} color="#d97706"/>
                </Pressable>
            }
            <Text className="text-white">{servings}</Text>
            <Pressable onPress={() => updateServings("add")}>
                <Plus size={18} color="#d97706"/>
            </Pressable>
        </View>
    );
};