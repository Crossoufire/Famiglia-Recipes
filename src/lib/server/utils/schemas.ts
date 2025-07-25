import {z} from "zod";


export const ingredientSchema = z.object({
    quantity: z.string().min(1, "Quantity is required").trim(),
    description: z.string().min(1, "Ingredient is required").trim(),
});


export const stepSchema = z.object({
    content: z.string().min(1, "Step cannot be empty").trim(),
});

export const recipeFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    cooking: z.number().int().positive("Cooking time must be a positive number"),
    preparation: z.number().int().positive("Preparation time must be a positive number"),
    servings: z.number().int().positive("Servings must be a positive number"),
    ingredients: z.array(ingredientSchema).min(1, "At least one ingredient is required"),
    steps: z.array(stepSchema).min(1, "At least one step is required"),
    labels: z.array(z.string()).min(1, "At least one label is required"),
    comment: z.string().optional(),
});


export const frontRecipeFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    preparation: z.number().int().positive("Preparation time must be a positive number"),
    cooking: z.number().int().positive("Cooking time must be a positive number"),
    servings: z.number().int().positive("Number of servings must be a positive number"),
    ingredients: z.array(ingredientSchema).min(1, "At least one ingredient is required"),
    steps: z.array(stepSchema).min(1, "At least one step is required"),
    labels: z.array(z.string()).min(1, "At least one label is required"),
    comment: z.string().optional(),
    image: z.instanceof(File).optional(),
});


export const editRecipeSchema = z.object({
    id: z.string(),
    title: z.string().min(1, "Title is required"),
    cooking: z.number().int().positive("Cooking time must be a positive number"),
    preparation: z.number().int().positive("Preparation time must be a positive number"),
    servings: z.number().int().positive("Servings must be a positive number"),
    ingredients: z.array(ingredientSchema).min(1, "At least one ingredient is required"),
    steps: z.array(stepSchema).min(1, "At least one step is required"),
    labels: z.array(z.string()).min(1, "At least one label is required"),
});


export const imageRecipeSchema = z
    .instanceof(File)
    .refine((file) => file.size <= 5000000, "Max image size is 5MB.")
    .optional()


export type RecipeFormValues = z.infer<typeof frontRecipeFormSchema>;
