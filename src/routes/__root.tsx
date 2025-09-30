/// <reference types="vite/client"/>
import appCss from "~/styles.css?url";
import {I18nextProvider} from "react-i18next";
import i18nInstance from "~/lib/client/i18n/i18n";
import {authOptions} from "~/lib/client/react-query";
import {type QueryClient} from "@tanstack/react-query";
import {Toaster} from "~/lib/client/components/ui/sonner";
import {Navbar} from "~/lib/client/components/app/Navbar";
import {Footer} from "~/lib/client/components/app/Footer";
import {TanStackDevtools} from "@tanstack/react-devtools";
import {useNProgress} from "~/lib/client/hooks/use-nprogress";
import {ReactQueryDevtoolsPanel} from "@tanstack/react-query-devtools";
import {TanStackRouterDevtoolsPanel} from "@tanstack/react-router-devtools";
import {createRootRouteWithContext, HeadContent, Outlet, Scripts} from "@tanstack/react-router";


export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
    ssr: false,
    beforeLoad: async ({ context: { queryClient } }) => queryClient.prefetchQuery(authOptions),
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
    useNProgress();

    return (
        <html lang="en" className="dark" suppressHydrationWarning>
        <head>
            <HeadContent/>
        </head>
        <body>

        <div id="root">
            <div className="flex flex-col min-h-[calc(100vh_-_64px)] mt-[64px]">
                <I18nextProvider i18n={i18nInstance}>
                    <Toaster/>
                    <Navbar/>
                    <main className="flex-1 w-[100%] max-w-[1320px] px-2 mx-auto">
                        <Outlet/>
                    </main>
                    <Footer/>
                </I18nextProvider>
            </div>

            {import.meta.env.DEV &&
                <TanStackDevtools
                    eventBusConfig={{
                        debug: false,
                        connectToServerBus: true,
                    }}
                    plugins={[
                        {
                            name: "TanStack Query",
                            render: <ReactQueryDevtoolsPanel/>,
                        },
                        {
                            name: "TanStack Router",
                            render: <TanStackRouterDevtoolsPanel/>,
                        },
                    ]}
                />
            }
        </div>

        <Scripts/>
        </body>
        </html>
    );
}
