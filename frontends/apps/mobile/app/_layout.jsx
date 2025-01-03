import "../global.css";
import {useEffect} from "react";
import {useFonts} from "expo-font";
import {StatusBar} from "expo-status-bar";
import {queryClient} from "@/libs/queryClient";
import {FontAwesome} from "@expo/vector-icons";
import {SplashScreen, Stack} from "expo-router";
import {ApiClientMobile} from "@/libs/apiClientMobile";
import {initializeApiClient} from "@famiglia-recipes/api";
import {QueryClientProvider} from "@tanstack/react-query";
import {DefaultTheme, ThemeProvider} from "@react-navigation/native";


// Catch errors thrown by Layout component
export {ErrorBoundary} from "expo-router";


const theme = {
    ...DefaultTheme,
    dark: true,
    colors: {
        primary: "hsl(0 0% 98%)",
        background: "hsl(0,0%,13%)",
        card: "hsl(206 18% 10%)",
        text: "hsl(0 0% 98%)",
        border: "hsl(0 0% 14.9%)",
        notification: "hsl(0,54%,42%)",
    },
};


// Prevent splash screen from auto-hiding before asset loading is complete
void SplashScreen.preventAutoHideAsync();


export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
        ...FontAwesome.font,
    });

    initializeApiClient(ApiClientMobile, "http://10.0.2.2:5000");

    // Expo Router uses Error Boundaries to catch errors in navigation tree
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            void SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <ThemeProvider value={theme}>
            <StatusBar style="dark"/>
            <QueryClientProvider client={queryClient}>
                <Stack>
                    <Stack.Screen name="login" options={{ headerShown: false }}/>
                    <Stack.Screen name="index" options={{ headerShown: false }}/>
                    <Stack.Screen name="(private)" options={{ headerShown: false }}/>
                </Stack>
            </QueryClientProvider>
        </ThemeProvider>
    );
}
