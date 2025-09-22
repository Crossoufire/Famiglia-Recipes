import * as schema from "./schema";
import {serverEnv} from "~/env/server";
import {drizzle} from "drizzle-orm/libsql";
import {createClient} from "@libsql/client";


const client = createClient({ url: serverEnv.DATABASE_URL });


export const db = drizzle({ client, schema, casing: "snake_case" });
