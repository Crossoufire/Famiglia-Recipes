import {fetcher} from "./helpers";
import {getApiClient} from "./apiClient";
import {queryOptions} from "@tanstack/react-query";


export const queryKeys = {
    authKey: () => ["currentUser"],
    addRecipeKey: () => ["addRecipe"],
    dashboardKey: () => ["dashboard"],
    allRecipesKey: () => ["allRecipes"],
    editRecipeKey: (recipeId) => ["editRecipe", recipeId],
    recipeCommentsKey: (recipeId) => ["comments", recipeId],
    recipeDetailsKey: (recipeId) => ["recipeDetails", recipeId],
};


export const authOptions = () => queryOptions({
    queryKey: queryKeys.authKey(),
    queryFn: () => getApiClient().fetchCurrentUser(),
    staleTime: Infinity,
});


export const dashboardOptions = () => queryOptions({
    queryKey: queryKeys.dashboardKey(),
    queryFn: () => fetcher({ url: "/dashboard" }),
});


export const allRecipesOptions = () => queryOptions({
    queryKey: queryKeys.allRecipesKey(),
    queryFn: () => fetcher({ url: "/all_recipes" }),
});


export const recipeDetailsOptions = (recipeId) => queryOptions({
    queryKey: queryKeys.recipeDetailsKey(recipeId),
    queryFn: () => fetcher({ url: `/details/${recipeId}` }),
});


export const recipeCommentsOptions = (recipeId) => queryOptions({
    queryKey: queryKeys.recipeCommentsKey(recipeId),
    queryFn: () => fetcher({ url: `/recipe/${recipeId}/comments` }),
});


export const addRecipeOptions = () => queryOptions({
    queryKey: queryKeys.addRecipeKey(),
    queryFn: () => fetcher({ url: "/get_labels" }),
});


export const editRecipeOptions = (recipeId) => queryOptions({
    queryKey: queryKeys.editRecipeKey(recipeId),
    queryFn: () => fetcher({ url: `/edit_recipe/${recipeId}` }),
});
