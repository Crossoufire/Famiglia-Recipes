export default {
    apps: [{
        name: "famiglia-recipes",
        script: ".output/server/index.mjs",

        instances: 1,
        exec_mode: "fork",

        env_production: {
            NODE_ENV: "production",
            PORT: 3000,
        },

        max_restarts: 5,
        restart_delay: 2000,
        max_memory_restart: "500M",

        watch: false,
        autorestart: true,
    }],
};
