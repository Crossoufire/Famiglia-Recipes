import {queryOptions} from "@tanstack/react-query";
import {getCurrentUser} from "~/lib/server/functions/user";
import {getLabels} from "~/lib/server/functions/add-recipe";
import {getDashboard} from "~/lib/server/functions/dashboard";
import {getEditRecipe} from "~/lib/server/functions/edit-recipe";
import {getAllRecipes} from "~/lib/server/functions/all-recipes";
import {getComments, getDetails} from "~/lib/server/functions/recipe-details";


export const authOptions = queryOptions({
    queryKey: ["currentUser"],
    queryFn: () => getCurrentUser(),
    staleTime: 60 * 1000,
});


export const dashboardOptions = queryOptions({
    queryKey: ["dashboard"],
    queryFn: () => getDashboard(),
});


export const allRecipesOptions = queryOptions({
    queryKey: ["allRecipes"],
    queryFn: () => getAllRecipes(),
});


export const recipeDetailsOptions = (recipeId: number) => queryOptions({
    queryKey: ["recipeDetails", recipeId.toString()],
    queryFn: () => getDetails({ data: recipeId.toString() }),
});


export const recipeCommentsOptions = (recipeId: number) => queryOptions({
    queryKey: ["comments", recipeId.toString()],
    queryFn: () => getComments({ data: recipeId.toString() }),
    placeholderData: [],
});


export const addRecipeOptions = queryOptions({
    queryKey: ["addRecipe"],
    queryFn: () => getLabels(),
});


export const editRecipeOptions = (recipeId: number) => queryOptions({
    queryKey: ["editRecipe", recipeId.toString()],
    queryFn: () => getEditRecipe({ data: recipeId.toString() }),
});
