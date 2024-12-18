import {lazy} from "react";
import {Navbar} from "@/components/app/Navbar";
import {Footer} from "@/components/app/Footer";
import {Toaster} from "@/components/ui/sonner";
import {createRootRouteWithContext, Outlet, ScrollRestoration} from "@tanstack/react-router";


// noinspection JSUnusedGlobalSymbols
export const Route = createRootRouteWithContext()({
    component: RootComponent,
});


function RootComponent() {
    return (
        <>
            <Toaster/>
            <Navbar/>
            <main className="md:max-w-screen-xl container">
                <ScrollRestoration/>
                <Outlet/>
            </main>
            <Footer/>
            {import.meta.env.DEV && <ReactQueryDevtools/>}
            {import.meta.env.DEV && <TanStackRouterDevtools/>}
        </>
    );
}


const TanStackRouterDevtools = lazy(() =>
    import("@tanstack/router-devtools").then((res) => ({ default: res.TanStackRouterDevtools }))
);

const ReactQueryDevtools = lazy(() =>
    import("@tanstack/react-query-devtools").then((res) => ({ default: res.ReactQueryDevtools }))
);
