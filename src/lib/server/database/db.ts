import * as schema from "./schema";
import {drizzle} from "drizzle-orm/libsql";
import {createClient} from "@libsql/client";


const client = createClient({ url: process.env.DATABASE_URL as string });


export const db = drizzle({ client, schema, casing: "snake_case" });
