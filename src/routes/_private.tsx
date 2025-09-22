import {authOptions} from "~/lib/react-query";
import {createFileRoute, redirect} from "@tanstack/react-router";


export const Route = createFileRoute("/_private")({
    beforeLoad: ({ context: { queryClient } }) => {
        const currentUser = queryClient.getQueryData(authOptions.queryKey);
        if (!currentUser) {
            throw redirect({ to: "/" });
        }
    },
});
