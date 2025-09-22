import {useState} from "react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {Button} from "~/lib/components/ui/button";
import {useQueryClient} from "@tanstack/react-query";
import {Textarea} from "~/lib/components/ui/textarea";
import {Comment} from "~/lib/components/details/CommentSection";
import {recipeCommentsOptions, useAddComment, useEditComment} from "~/lib/react-query";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "~/lib/components/ui/form";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "~/lib/components/ui/dialog";


interface CommentDialogProps {
    open: boolean;
    recipeId: number;
    commentToEdit: Comment | null;
    setOpen: (open: boolean) => void;
}


export const CommentDialog = ({ open, setOpen, commentToEdit, recipeId }: CommentDialogProps) => {
    const { t } = useTranslation();
    const isEditing = !!commentToEdit;
    const addComment = useAddComment();
    const editComment = useEditComment();
    const queryClient = useQueryClient();
    const [warning, setWarning] = useState(false);
    const form = useForm<Comment>({
        defaultValues: {
            content: isEditing ? commentToEdit.content : "",
        }
    });

    function onSubmit(data: Comment) {
        if (!data.content.trim())
            return setWarning(true);

        if (commentToEdit?.id) {
            editComment.mutate({ commentId: commentToEdit.id, content: data.content }, {
                onSuccess: async () => {
                    form.reset();
                    setOpen(false);
                    await queryClient.invalidateQueries({ queryKey: recipeCommentsOptions(recipeId).queryKey });
                },
            });
        }
        else {
            addComment.mutate({ recipeId, content: data.content }, {
                onSuccess: async () => {
                    form.reset();
                    setOpen(false);
                    await queryClient.invalidateQueries({ queryKey: recipeCommentsOptions(recipeId).queryKey });
                },
            });
        }
    }

    const title = isEditing ? t("edit-comment") : t("add-comment");
    const subtitle = isEditing ? t("ec-subtitle") : t("ac-subtitle");

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-sm:w-full w-[450px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{subtitle}</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            name="content"
                            control={form.control}
                            render={({ field }) =>
                                <FormItem>
                                    <FormLabel className="sr-only">Comment</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            className="h-[150px]"
                                            placeholder={t("c-placeholder")}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {warning ? <div className="text-red-500">{t("c-error")}</div> : t("c-info")}
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            }
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={addComment.isPending || editComment.isPending}>
                                {(addComment.isPending || editComment.isPending) ? t("submitting") : t("save")}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
