import {getApiClient} from "@famiglia-recipes/api";
import {createFileRoute, redirect} from "@tanstack/react-router";


// noinspection JSCheckFunctionSignatures,JSUnusedGlobalSymbols
export const Route = createFileRoute("/_public")({
    beforeLoad: async ({ context: { auth } }) => {
        const apiClient = getApiClient();
        const isAuthenticated = await apiClient.isAuthenticated();
        if (auth.currentUser && isAuthenticated) {
            throw redirect({ to: "/dashboard" });
        }
    },
});
