import {defineConfig} from "vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import {tanstackStart} from "@tanstack/react-start/plugin/vite";


export default defineConfig({
    plugins: [
        tsConfigPaths({ projects: ["./tsconfig.json"] }),
        tailwindcss(),
        tanstackStart({
            target: "node-server",
            customViteReactPlugin: true,
            spa: {
                enabled: true,
            },
            tsr: {
                semicolons: true,
                quoteStyle: "double",
            },
        }),
        viteReact({
            babel: {
                plugins: [["babel-plugin-react-compiler", { target: "19" }]],
            },
        }),
    ],
})
