// import "./global-middleware";
import {toast} from "sonner";
import {routeTree} from "~/routeTree.gen";
import {NotFound} from "~/lib/components/app/NotFound";
import {routerWithQueryClient} from "@tanstack/react-router-with-query";
import {ErrorCatchBoundary} from "~/lib/components/app/ErrorCatchBoundary";
import {createRouter as createTanStackRouter} from "@tanstack/react-router";
import {MutationCache, QueryCache, QueryClient} from "@tanstack/react-query";


export function createRouter() {
    const queryClient = new QueryClient({
        queryCache: new QueryCache({
            onError: (error, query) => {
                if (query?.meta?.displayErrorMsg) {
                    toast.error(error.message);
                }
                if (query?.meta?.errorMessage) {
                    toast.error(query.meta.errorMessage.toString());
                }
            },
        }),
        mutationCache: new MutationCache({
            onError: (error) => {
                toast.error(error.message);
            },
        }),
        defaultOptions: {
            queries: {
                retry: false,
                staleTime: 2 * 1000,
                refetchOnWindowFocus: false,
            },
        },
    });

    return routerWithQueryClient(
        createTanStackRouter({
            routeTree,
            context: { queryClient },
            defaultPreload: false,
            defaultPreloadStaleTime: 0,
            defaultErrorComponent: ErrorCatchBoundary,
            defaultNotFoundComponent: NotFound,
            scrollRestoration: true,
            defaultStructuralSharing: true,
            defaultSsr: false,
        }),
        queryClient,
    );
}


declare module "@tanstack/react-router" {
    interface Register {
        router: ReturnType<typeof createRouter>;
    }
}
