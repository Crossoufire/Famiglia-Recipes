import {queryOptions} from "@tanstack/react-query";
import {getCurrentUser} from "~/lib/server/functions/user";
import {getLabels} from "~/lib/server/functions/add-recipe";
import {getDashboard} from "~/lib/server/functions/dashboard";
import {getEditRecipe} from "~/lib/server/functions/edit-recipe";
import {getAllRecipes} from "~/lib/server/functions/all-recipes";
import {getComments, getDetails} from "~/lib/server/functions/recipe-details";


export const queryKeys = {
    authKey: () => ["currentUser"] as const,
    addRecipeKey: () => ["addRecipe"] as const,
    dashboardKey: () => ["dashboard"] as const,
    allRecipesKey: () => ["allRecipes"] as const,
    editRecipeKey: (recipeId: number) => ["editRecipe", recipeId.toString()] as const,
    recipeCommentsKey: (recipeId: number) => ["comments", recipeId.toString()] as const,
    recipeDetailsKey: (recipeId: number) => ["recipeDetails", recipeId.toString()] as const,
};


export const authOptions = () => queryOptions({
    queryKey: queryKeys.authKey(),
    queryFn: () => getCurrentUser(),
    staleTime: 60 * 1000,
});


export const dashboardOptions = () => queryOptions({
    queryKey: queryKeys.dashboardKey(),
    queryFn: () => getDashboard(),
});


export const allRecipesOptions = () => queryOptions({
    queryKey: queryKeys.allRecipesKey(),
    queryFn: () => getAllRecipes(),
});


export const recipeDetailsOptions = (recipeId: number) => queryOptions({
    queryKey: queryKeys.recipeDetailsKey(recipeId),
    queryFn: () => getDetails({ data: recipeId.toString() }),
});


export const recipeCommentsOptions = (recipeId: number) => queryOptions({
    queryKey: queryKeys.recipeCommentsKey(recipeId),
    queryFn: () => getComments({ data: recipeId.toString() }),
    placeholderData: [],
});


export const addRecipeOptions = () => queryOptions({
    queryKey: queryKeys.addRecipeKey(),
    queryFn: () => getLabels(),
});


export const editRecipeOptions = (recipeId: number) => queryOptions({
    queryKey: queryKeys.editRecipeKey(recipeId),
    queryFn: () => getEditRecipe({ data: recipeId.toString() }),
});
