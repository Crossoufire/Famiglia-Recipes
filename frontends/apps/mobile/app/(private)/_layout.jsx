import {Redirect, Stack} from "expo-router";
import {useAuth} from "@famiglia-recipes/api";


export default function PrivateLayout() {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return <Redirect href="/login"/>;
    }

    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
            <Stack.Screen name="details/[recipeId]" options={{ title: "Details" }}/>
        </Stack>
    );
}
