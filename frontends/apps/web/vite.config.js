import {resolve} from "path";
import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import TanStackRouterVite from "@tanstack/router-plugin/vite";


/** @type {import("vite").UserConfig} */
export default defineConfig({
    plugins: [
        TanStackRouterVite(),
        // react(),
        react({ babel: { plugins: [["babel-plugin-react-compiler"]] } }),
    ],
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
            "@famiglia-recipes/api": resolve(__dirname, "../../libs/api"),
        },
    },
    server: {
        open: true,
        port: 3000,
        proxy: {
            "/api": {
                target: "http://localhost:5000",
                changeOrigin: true,
            }
        }
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ["react", "react-dom"],
                    apiLib: ["@famiglia-recipes/api"],
                },
            },
        },
    },
});