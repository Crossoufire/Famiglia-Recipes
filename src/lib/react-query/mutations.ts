import {useMutation} from "@tanstack/react-query";
import {postAddRecipe} from "../server/functions/add-recipe";
import {postEditRecipe} from "~/lib/server/functions/edit-recipe";
import {deleteComment, editComment} from "../server/functions/recipe-details";
import {addComment, deleteRecipe, favoriteRecipe} from "~/lib/server/functions/recipe-details";


export const useDeleteRecipe = () => {
    return useMutation({
        mutationFn: ({ recipeId }: { recipeId: string }) => deleteRecipe({ data: recipeId }),
    });
};


export const useFavoriteRecipe = () => {
    return useMutation({
        mutationFn: ({ recipeId }: { recipeId: string }) => favoriteRecipe({ data: recipeId }),
    });
};


export const useDeleteComment = () => {
    return useMutation({
        mutationFn: ({ commentId }: { commentId: number }) => deleteComment({ data: commentId }),
    });
};


export const useAddComment = () => {
    return useMutation({
        mutationFn: ({ recipeId, content }: { recipeId: number, content: string }) => addComment({ data: { recipeId, content } }),
    });
};


export const useEditComment = () => {
    return useMutation({
        mutationFn: ({ commentId, content }: { commentId: number, content: string }) => editComment({ data: { commentId, content } }),
    });
};


export const useUpdateRecipe = () => {
    return useMutation({
        mutationFn: ({ formData }: { formData: FormData }) => postEditRecipe({ data: formData }),
    });
}


export const useAddRecipe = () => {
    return useMutation({
        mutationFn: ({ data }: { data: FormData }) => postAddRecipe({ data }),
    });
}
