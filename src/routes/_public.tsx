import {queryKeys} from "~/lib/react-query";
import {CurrentUser} from "~/lib/server/types/types";
import {createFileRoute, redirect} from "@tanstack/react-router";


export const Route = createFileRoute("/_public")({
    validateSearch: ({ search }) => search as { authExpired?: boolean },
    beforeLoad: async ({ context: { queryClient }, search }) => {
        const currentUser: CurrentUser = queryClient.getQueryData(queryKeys.authKey());
        
        if (search.authExpired) {
            await queryClient.invalidateQueries({ queryKey: queryKeys.authKey() });
            queryClient.clear();
            throw redirect({ to: "/", replace: true });
        }

        if (currentUser) {
            throw redirect({ to: "/dashboard", replace: true });
        }
    },
});
