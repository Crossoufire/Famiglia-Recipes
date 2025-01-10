import {toast} from "sonner";
import {useState} from "react";
import {bgSelector} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {queryClient} from "@/lib/queryClient";
import {MutedText} from "@/components/app/MutedText";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {useIsMutating, useQuery} from "@tanstack/react-query";
import {CommentDialog} from "@/components/details/CommentDialog";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {ChefHat, LoaderCircle, Pencil, Plus, Trash2} from "lucide-react";
import {queryKeys, recipeCommentsOptions, useMutations} from "@famiglia-recipes/api";


export const CommentSection = ({ recipeId, currentUserId, recipeSubmitterId }) => {
    const isMutating = useIsMutating();
    const { deleteComment } = useMutations();
    const [isOpen, setIsOpen] = useState(false);
    const [commentToEdit, setCommentToEdit] = useState(null);
    const { data: comments, isLoading, isFetching, isError } = useQuery(recipeCommentsOptions(recipeId));

    if (isError) return <p>The comments could not be loaded.</p>;
    if (isLoading) return <LoaderCircle className="h-6 w-6 animate-spin"/>;

    const onEditComment = (comment) => {
        setIsOpen(true);
        setCommentToEdit(comment);
    };

    const onAddComment = () => {
        setIsOpen(true);
        setCommentToEdit(null);
    };

    const onDeleteComment = (comment) => {
        deleteComment.mutate({ comment_id: comment.id }, {
            onSuccess: async () => {
                await queryClient.invalidateQueries({ queryKey: queryKeys.recipeCommentsKey(recipeId) });
                toast.success("Comment deleted");
            },
        });
    };

    return (
        <>
            <h2 className="text-2xl flex justify-between items-center font-semibold tracking-tight mb-6">
                <div>
                    Comments
                    <span className="text-muted-foreground text-sm font-normal ml-2">({comments?.length ?? 0})</span>
                </div>
                <Button variant="secondary" onClick={onAddComment}>
                    <Plus className="h-5 w-5 mr-2"/> Add Comment
                </Button>
            </h2>
            {comments.length > 0 ?
                comments.map(comment =>
                    <div key={comment.id}>
                        <Card className="relative bg-zinc-900 text-gray-100 mb-4">
                            <CardHeader className="flex flex-row items-center gap-4 py-3 px-4">
                                <Avatar className="w-10 h-10">
                                    <AvatarFallback className={bgSelector(comment.submitter.username)}>
                                        {comment.submitter.username.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 -mt-2">
                                        <span className="font-semibold">{comment.submitter.username}</span>
                                        {comment.user_id === recipeSubmitterId &&
                                            <ChefHat className="w-4 h-4 text-amber-500"/>
                                        }
                                    </div>
                                    <time className="text-sm text-gray-400">
                                        {comment.updated_at ?? comment.created_at}
                                    </time>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-3 mt-1">
                                <div className="text-gray-300">{comment.content}</div>
                            </CardContent>
                            {comment.user_id === currentUserId &&
                                <div className="absolute right-1 top-1">
                                    <Button variant="ghost" size="icon" onClick={() => onEditComment(comment)}
                                            disabled={(!!isMutating || isFetching)}>
                                        <Pencil className="w-4 h-4 opacity-50"/>
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => onDeleteComment(comment)}
                                            disabled={(!!isMutating || isFetching)}>
                                        <Trash2 className="w-4 h-4 opacity-50"/>
                                    </Button>
                                </div>
                            }
                        </Card>
                    </div>
                )
                :
                <MutedText className="text-base -mt-2">No comments added yet</MutedText>
            }
            {isOpen &&
                <CommentDialog
                    open={isOpen}
                    setOpen={setIsOpen}
                    recipeId={recipeId}
                    commentToEdit={commentToEdit}
                />
            }
        </>
    );
};