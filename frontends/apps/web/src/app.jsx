import {router} from "@/router";
import {queryClient} from "@/lib/queryClient";
import {ApiClientWeb} from "@/lib/apiClientWeb";
import {RouterProvider} from "@tanstack/react-router";
import {ThemeProvider} from "@/providers/ThemeProvider";
import {QueryClientProvider} from "@tanstack/react-query";
import {initializeApiClient, useAuth} from "@famiglia-recipes/api";


export default function App() {
    initializeApiClient(ApiClientWeb, import.meta.env.VITE_BASE_API_URL);

    return (
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <InnerApp/>
            </QueryClientProvider>
        </ThemeProvider>
    );
}


function InnerApp() {
    const auth = useAuth();
    if (auth.isLoading) return null;
    return <RouterProvider router={router} context={{ auth, queryClient }}/>;
}
