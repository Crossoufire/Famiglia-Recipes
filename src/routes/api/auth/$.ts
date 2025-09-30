import {auth} from "~/lib/server/core/auth";
import {createFileRoute} from "@tanstack/react-router";


export const Route = createFileRoute("/api/auth/$")({
    server: {
        handlers: {
            GET: ({ request }) => {
                return auth.handler(request);
            },
            POST: ({ request }) => {
                return auth.handler(request);
            },
        },
    },
});
