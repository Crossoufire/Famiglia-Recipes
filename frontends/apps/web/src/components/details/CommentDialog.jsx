import {useState} from "react";
import {useForm} from "react-hook-form";
import {queryClient} from "@/lib/queryClient";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {queryKeys, useMutations} from "@famiglia-recipes/api";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";


export const CommentDialog = ({ open, setOpen, commentToEdit, recipeId }) => {
    const isEditing = !!commentToEdit;
    const { addComment, editComment } = useMutations();
    const [warning, setWarning] = useState(false);
    const form = useForm({ defaultValues: { content: isEditing ? commentToEdit.content : "" } });

    function onSubmit(data) {
        if (!data.content.trim())
            return setWarning(true);

        if (commentToEdit?.id) {
            editComment.mutate({ comment_id: commentToEdit.id, content: data.content }, {
                onSuccess: async () => {
                    form.reset();
                    setOpen(false);
                    await queryClient.invalidateQueries({ queryKey: queryKeys.recipeCommentsKey(recipeId) });
                },
            });
        }
        else {
            addComment.mutate({ recipe_id: recipeId, content: data.content }, {
                onSuccess: async () => {
                    form.reset();
                    setOpen(false);
                    await queryClient.invalidateQueries({ queryKey: queryKeys.recipeCommentsKey(recipeId) });
                },
            });
        }
    }

    const buttonText = isEditing ? "Save" : "Add Comment";
    const title = isEditing ? "Edit comment" : "Add comment";
    const subtitle = isEditing ? "Edit your comment for this recipe" : "Add a new comment to this recipe";

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
                                            placeholder="Add your comment here"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {warning ?
                                            <div className="text-red-500">Comment cannot be empty</div>
                                            :
                                            "Your comment will be visible to other users."
                                        }
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            }
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={addComment.isPending || editComment.isPending}>
                                {(addComment.isPending || editComment.isPending) ? "Submitting..." : buttonText}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
