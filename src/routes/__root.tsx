/// <reference types="vite/client"/>
import appCss from "~/styles.css?url";
import i18nInstance from "~/lib/i18n/i18n";
import React, {lazy, Suspense} from "react";
import {I18nextProvider} from "react-i18next";
import {authOptions} from "~/lib/react-query";
import {Toaster} from "~/lib/components/ui/sonner";
import {Navbar} from "~/lib/components/app/Navbar";
import {Footer} from "~/lib/components/app/Footer";
import {useNProgress} from "~/lib/hooks/use-nprogress";
import {type QueryClient} from "@tanstack/react-query";
import {createRootRouteWithContext, HeadContent, Outlet, Scripts} from "@tanstack/react-router";


export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
    beforeLoad: async ({ context: { queryClient } }) => {
        return queryClient.fetchQuery(authOptions);
    },
    head: () => ({
        meta: [
            { charSet: "UTF-8" },
            { name: "viewport", content: "width=device-width, initial-scale=1" },
            { title: "Famiglia-Recipes" },
        ],
        links: [{ rel: "stylesheet", href: appCss }],
    }),
    component: RootComponent,
    shellComponent: RootComponent,
});


function RootComponent() {
    return (
        <RootDocument>
            <Suspense fallback={<div>Loading...</div>}>
                <Outlet/>
            </Suspense>
        </RootDocument>
    );
}


function RootDocument({ children }: { readonly children: React.ReactNode }) {
    useNProgress();

    return (
        <html className="dark" suppressHydrationWarning>
        <head>
            <HeadContent/>
        </head>
        <body>

        <div id="root">
            <I18nextProvider i18n={i18nInstance}>
                <Toaster/>
                <Navbar/>
                <main className="max-w-screen-xl container mx-auto px-0.5">
                    {children}
                </main>
                <Footer/>
                {import.meta.env.DEV && <ReactQueryDevtools/>}
                {import.meta.env.DEV && <TanStackRouterDevtools/>}
            </I18nextProvider>
        </div>

        <Scripts/>
        </body>
        </html>
    );
}


const TanStackRouterDevtools = lazy(() =>
    import("@tanstack/react-router-devtools").then((res) => ({ default: res.TanStackRouterDevtools }))
);

const ReactQueryDevtools = lazy(() =>
    import("@tanstack/react-query-devtools").then((res) => ({ default: res.ReactQueryDevtools }))
);