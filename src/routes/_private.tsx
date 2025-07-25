import {queryKeys} from "~/lib/react-query";
import {CurrentUser} from "~/lib/server/types/types";
import {createFileRoute, redirect} from "@tanstack/react-router";


export const Route = createFileRoute("/_private")({
    beforeLoad: ({ context: { queryClient } }) => {
        const currentUser: CurrentUser = queryClient.getQueryData(queryKeys.authKey());
        if (!currentUser) {
            throw redirect({ to: "/" });
        }
    },
});
