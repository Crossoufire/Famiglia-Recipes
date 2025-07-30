import dotenv from "dotenv";
import type {Config} from "drizzle-kit";


dotenv.config({ path: ".env", quiet: true });


export default {
    out: "./.drizzle",
    schema: "./src/lib/server/database/schema/index.ts",
    breakpoints: true,
    verbose: true,
    strict: true,
    dialect: "sqlite",
    casing: "snake_case",
    dbCredentials: {
        url: process.env.DATABASE_URL as string,
    },
} satisfies Config;
