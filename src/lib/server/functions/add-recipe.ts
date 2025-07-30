import {asc, inArray} from "drizzle-orm";
import {db} from "~/lib/server/database/db";
import {createServerFn} from "@tanstack/react-start";
import {HEIGHT, WIDTH} from "~/lib/server/utils/constants";
import {tryFormZodError} from "~/lib/server/utils/zod-errors";
import {saveUploadedImage} from "~/lib/server/utils/image-handler";
import {authMiddleware} from "~/lib/server/middleware/auth-guard";
import {imageRecipeSchema, recipeFormSchema} from "~/lib/server/utils/schemas";
import {comment, label, recipe, recipeLabel} from "~/lib/server/database/schema";


export const getLabels = createServerFn({ method: "GET" })
    .middleware([authMiddleware])
    .handler(async () => {
        return db
            .select()
            .from(label)
            .orderBy(asc(label.order));
    })


export const postAddRecipe = createServerFn({ method: "POST" })
    .middleware([authMiddleware])
    .validator((data: FormData) => {
        if (!(data instanceof FormData)) throw new Error("Invalid FormData");
        return data;
    })
    .handler(async ({ data, context: { currentUser } }) => {
        const formDataImage = data.get("image") as File;
        const formDataRecipe: string = data.get("recipe") as string;

        if (formDataImage) tryFormZodError(() => imageRecipeSchema.parse(formDataImage))
        const recipeData = tryFormZodError(() => recipeFormSchema.parse(JSON.parse(formDataRecipe)));

        let coverName = "default.png";
        if (formDataImage) {
            coverName = await saveUploadedImage({
                file: formDataImage,
                resize: { width: WIDTH, height: HEIGHT },
            });
        }

        const steps = recipeData.steps.map(step => ({ description: step.content }));
        const ingredients = recipeData.ingredients.map(ing => ({
            proportion: ing.quantity,
            ingredient: ing.description,
        }));

        const matchingLabels = await db
            .select()
            .from(label)
            .where(inArray(label.name, recipeData.labels));

        await db.transaction(async (tx) => {
            const [newRecipe] = await tx
                .insert(recipe)
                .values({
                    steps: steps,
                    image: coverName,
                    title: recipeData.title,
                    ingredients: ingredients,
                    submitterId: currentUser.id,
                    servings: recipeData.servings,
                    cookingTime: recipeData.cooking,
                    prepTime: recipeData.preparation,
                })
                .returning();

            if (matchingLabels.length) {
                await tx
                    .insert(recipeLabel)
                    .values(matchingLabels.map(l => ({ recipeId: newRecipe.id, labelId: l.id })));
            }

            if (recipeData.comment) {
                await tx
                    .insert(comment)
                    .values({
                        userId: currentUser.id,
                        recipeId: newRecipe.id,
                        content: recipeData.comment,
                    });
            }
        });
    });
