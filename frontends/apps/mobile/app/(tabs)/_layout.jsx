import {Tabs} from "expo-router";
import {Home, PlusCircle, Search} from "lucide-react-native";


export default function TabLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="dashboard/index"
                options={{ title: "Dashboard", tabBarIcon: () => <Home color="#e2e2e2" size={18}/> }}
            />
            <Tabs.Screen
                name="all-recipes/index"
                options={{ title: "All Recipes", tabBarIcon: () => <Search color="#e2e2e2" size={18}/> }}
            />
            <Tabs.Screen
                name="add-recipe/index"
                options={{ title: "Add Recipe", tabBarIcon: () => <PlusCircle color="#e2e2e2" size={18}/> }}
            />
        </Tabs>
    );
}
