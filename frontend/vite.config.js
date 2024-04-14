import path from "path";
import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";


/** @type {import('vite').UserConfig} */
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        watch: {
            usePolling: true,
            interval: 300,
        },
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
            external: ["graphql"],
            output: {
                manualChunks: {
                    react: ["react", "react-dom"],
                },
            },
        },
    },
})
