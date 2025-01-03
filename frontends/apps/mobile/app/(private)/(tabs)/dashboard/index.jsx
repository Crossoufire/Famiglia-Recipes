import {Link} from "expo-router";
import {Loading} from "@/components/Loading";
import {useQuery} from "@tanstack/react-query";
import {ChefHat, Clock} from "lucide-react-native";
import {dashboardOptions} from "@famiglia-recipes/api";
import {Image, RefreshControl, ScrollView, Text, View} from "react-native";


export default function DashboardScreen() {
    const { data, isLoading, error, refetch, isRefetching } = useQuery(dashboardOptions());

    if (isLoading) return <Loading/>;
    if (error) return <Text>Error: {error?.description}</Text>;

    return (
        <ScrollView className="flex-1 px-4 pt-6" refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch}/>}>
            <View className="mb-12">
                <Text className="text-2xl text-white font-semibold mb-4">
                    Favorites
                </Text>
                <ScrollView>
                    {data.favorite_recipes.map(recipe => (
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                        />
                    ))}
                </ScrollView>
            </View>
            <View>
                <Text className="text-2xl text-white font-semibold mb-4">
                    Recently Added
                </Text>
                <View className="flex flex-col gap-8">
                    {data.last_recipes.map(recipe => (
                        <RecipeCard
                            key={recipe.id}
                            recipe={recipe}
                        />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}


const RecipeCard = ({ recipe }) => {
    return (
        <Link href={`/details/${recipe.id}`}>
            <View className="flex flex-col rounded-lg bg-card w-full">
                <View className="relative overflow-hidden rounded-t-lg">
                    <Image
                        alt={recipe.title}
                        className="object-cover bg-slate-700 w-full h-[250px]"
                        source={{ uri: recipe.cover_image || "https://placehold.co/300x200" }}
                    />
                </View>
                <View className="flex flex-col flex-grow">
                    <View className="flex flex-col gap-4 p-6">
                        <View className="flex flex-row items-center justify-between text-sm text-muted-foreground">
                            <View className="flex flex-row items-center gap-2">
                                <Clock size={18} color="#d97706"/>
                                <Text className="text-white">Prep: {recipe.prep_time} min</Text>
                            </View>
                            <View className="flex flex-row items-center gap-2">
                                <ChefHat size={18} color="#d97706"/>
                                <Text className="text-white">Cook: {recipe.cooking_time} min</Text>
                            </View>
                        </View>
                        <View className="mt-2">
                            <Text className="text-3xl text-white font-bold tracking-tight line-clamp-2">
                                {recipe.title}
                            </Text>
                            <Text className="text-sm text-neutral-300">
                                Added by <Text className="font-bold">{recipe.submitter.username}</Text> on {recipe.submitted_date}
                            </Text>
                        </View>
                    </View>
                    <View className="flex justify-start mt-auto p-6 pt-0 pb-6">
                        <View className="flex flex-row flex-wrap gap-2">
                            {recipe.labels.map(label =>
                                <Text key={label.id} className="px-3 py-1 rounded-full text-white"
                                      style={{ backgroundColor: label.color }}>
                                    {label.name}
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        </Link>
    );
};
