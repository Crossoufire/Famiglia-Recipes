import {asc} from "drizzle-orm";
import {db} from "~/lib/server/database/db";
import {label} from "~/lib/server/database/schema";
import {createServerFn} from "@tanstack/react-start";
import {authMiddleware} from "~/lib/server/middleware/auth-guard";


export const getAllRecipes = createServerFn({ method: "GET" })
    .middleware([authMiddleware])
    .handler(async () => {
        const allLabels = await db
            .select()
            .from(label)
            .orderBy(asc(label.order));

        const allRecipes = await db.query.recipe.findMany({
            with: { recipeLabels: { with: { label: true } } },
        });

        return {
            labels: allLabels,
            recipes: allRecipes,
        };
    });
