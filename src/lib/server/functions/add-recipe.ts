import z from "zod";
import mammoth from "mammoth";
import {asc, inArray} from "drizzle-orm";
import {db} from "~/lib/server/database/db";
import {createServerFn} from "@tanstack/react-start";
import {Message, Request} from "~/lib/server/types/types";
import {HEIGHT, WIDTH} from "~/lib/server/utils/constants";
import {tryFormZodError} from "~/lib/server/utils/zod-errors";
import {FormattedError} from "~/lib/server/utils/error-classes";
import {authMiddleware} from "~/lib/server/middleware/auth-guard";
import {fileToBase64, saveUploadedImage} from "~/lib/server/utils/image-handler";
import {comment, label, recipe, recipeLabel} from "~/lib/server/database/schema";
import {imageRecipeSchema, recipeFormSchema, uploadRecipeSchema} from "~/lib/server/utils/schemas";


const PDF_TYPE = ".pdf";
const DOCUMENT_TYPES = [".doc", ".docx"];
const IMAGE_TYPES = [".png", ".jpg", ".jpeg", ".webp"];


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
        const ingredients = recipeData.ingredients.map((ing) => ({
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


export const uploadRecipeForParsing = createServerFn({ method: "POST" })
    .middleware([authMiddleware])
    .validator((data: FormData) => {
        if (!(data instanceof FormData)) throw new Error("Invalid FormData");
        return data;
    })
    .handler(async ({ data }) => {
        let fileForAI: File | null = null;
        let textContent: string | null = null;

        const validatedData = uploadRecipeSchema.parse({ type: data.get("type"), content: data.get("content") });
        if (validatedData.type === "text") {
            textContent = validatedData.content as string;
        }
        else {
            const file = validatedData.content as File;
            const fileName = file.name.toLowerCase();
            const fileExtension = fileName.substring(fileName.lastIndexOf("."));

            if (DOCUMENT_TYPES.includes(fileExtension)) {
                try {
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    const result = await mammoth.extractRawText({ buffer: buffer });
                    textContent = result.value;
                }
                catch {
                    throw new FormattedError("Failed to extract text. Try another one.");
                }
            }
            else if (IMAGE_TYPES.includes(fileExtension) || fileExtension === PDF_TYPE) {
                fileForAI = file;
            }
            else {
                throw new FormattedError(`Unsupported file type: ${fileExtension}`);
            }
        }

        return callGeminiModel(textContent, fileForAI);
    })


async function callGeminiModel(textContent: string | null, file: File | null) {
    const messages: Message[] = [];

    if (textContent) {
        messages.push({
            role: "user",
            content: `Ceci est la recette : ${textContent}. ${createRecipeText()}`,
        });
    }
    else if (file) {
        const base64Content = await fileToBase64(file) as string;

        if (file.type === "application/pdf") {
            messages.push({
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `Ce PDF contient la recette. ${createRecipeText}`,
                    },
                    {
                        //@ts-expect-error 'file' not on type but doc (https://openrouter.ai/docs/features/images-and-pdfs)
                        type: "file",
                        file: {
                            filename: "recipe.pdf",
                            file_data: `data:application/pdf;base64,${base64Content}`,
                        },
                    },
                ],
            });
        }
        else {
            messages.push({
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `Cette image contient la recette. ${createRecipeText}`,
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:image/jpeg;base64,${base64Content}`,
                        },
                    },
                ],
            });
        }
    }

    const requestBody: Request = {
        model: process.env.OPEN_ROUTER_MODEL_ID as string,
        max_tokens: 3000,
        messages: messages,
        response_format: {
            type: "json_schema",
            json_schema: {
                strict: true,
                name: "recipe",
                schema: z.toJSONSchema(recipeFormSchema),
            },
        },
        plugins: [
            {
                id: "file-parser",
                pdf: {
                    engine: "pdf-text",
                },
            },
        ],
    };

    const response = await fetch(`${process.env.OPEN_ROUTER_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
        },
        body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} - ${errorData}`);
    }

    const aiResponseData = await response.json();

    try {
        const jsonResponse = JSON.parse(aiResponseData.choices[0].message.content);
        return recipeFormSchema.parse(jsonResponse);
    }
    catch {
        throw new FormattedError("So... the AI bugged. Please try again later.", true);
    }
}


function createRecipeText() {
    // noinspection SpellCheckingInspection
    return `Retourne cette recette en utilisant ce format JSON est aucun autre text. UTILISE LE FRANCAIS. Pour la description 
    des étapes tu peux etre un peu plus court. Pour les labels tu a le choix entre (MAX 4) : Apéro, Plat, Dessert, Poisson, 
    Viande rouge, Viande blanche, Végétarien, Végan, Fruit de mer, Fruit, Légumineuse, Four, Casserole, Friteuse, Cuisson vapeur, 
    Micro-ondes, Grill, Entrée, Sauce, Cocotte-minute. JE REPETE RETOURNE LES DATA EN FRANCAIS. 
    RESPECTE CE FORMAT POUR LES INGREDIENTS (VALEUR NUMERIQUE DANS "quantity" ET UNITE ET CONTENU DANS "description"), exemple: 
    {
        quantity: 60,
        description: "cl. de jus de cuisson"
    },
    {
        quantity: 120,
        description: "gr. de Maizena"
    },
    {
        quantity: 100,
        description: "ml. de lait"
    },
    {
        quantity: 1,
        description: "pincé de poivre"
    },
    `.trim();
}
