import {fetcher, postFetcher} from "./helpers";
import {useMutation} from "@tanstack/react-query";


const mutationFunctionsMap = {
    resetPassword: ({ token, new_password }) => postFetcher({
        url: "/tokens/reset_password", data: { token, new_password },
    }),
    registerToken: ({ token }) => postFetcher({
        url: "/tokens/register_token", data: { token },
    }),
    forgotPassword: ({ email, callback }) => postFetcher({
        url: "/tokens/reset_password_token", data: { email, callback },
    }),
    deleteRecipe: ({ recipe_id }) => postFetcher({
        url: "/delete_recipe", data: { recipe_id },
    }),
    updateFavorite: ({ recipe_id }) => postFetcher({
        url: "/update_favorite", data: { recipe_id },
    }),
    addRecipe: ({ data }) => postFetcher({
        url: "/add_recipe", data, options: { removeContentType: true },
    }),
    updateRecipe: ({ recipe_id, data }) => postFetcher({
        url: `/edit_recipe/${recipe_id}`, data, options: { removeContentType: true },
    }),
    addComment: ({ recipe_id, content }) => postFetcher({
        url: `/recipe/${recipe_id}/comments`, data: { content },
    }),
    editComment: ({ comment_id, content }) => postFetcher({
        url: `/comments/${comment_id}`, data: { content },
    }),
    deleteComment: ({ comment_id }) => fetcher({
        url: `/comments/${comment_id}`, method: "delete",
    }),
};


export const useMutations = () => {
    const resetPassword = useMutation({ mutationFn: mutationFunctionsMap.resetPassword });
    const registerToken = useMutation({ mutationFn: mutationFunctionsMap.registerToken });
    const forgotPassword = useMutation({ mutationFn: mutationFunctionsMap.forgotPassword });
    const deleteRecipe = useMutation({ mutationFn: mutationFunctionsMap.deleteRecipe });
    const updateFavorite = useMutation({ mutationFn: mutationFunctionsMap.updateFavorite });
    const addRecipe = useMutation({ mutationFn: mutationFunctionsMap.addRecipe });
    const updateRecipe = useMutation({ mutationFn: mutationFunctionsMap.updateRecipe });
    const addComment = useMutation({ mutationFn: mutationFunctionsMap.addComment });
    const editComment = useMutation({ mutationFn: mutationFunctionsMap.editComment });
    const deleteComment = useMutation({ mutationFn: mutationFunctionsMap.deleteComment });

    return {
        resetPassword, registerToken, forgotPassword, deleteRecipe, updateFavorite,
        addRecipe, updateRecipe, addComment, editComment, deleteComment,
    };
};
