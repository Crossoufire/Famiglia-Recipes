import type {Config} from "drizzle-kit";


export default {
    out: "./.drizzle",
    schema: "./src/lib/server/database/schema/auth.schema.ts",
    breakpoints: true,
    verbose: true,
    strict: true,
    dialect: "sqlite",
    casing: "snake_case",
    dbCredentials: {
        url: process.env.DATABASE_URL as string,
    },
} satisfies Config;
