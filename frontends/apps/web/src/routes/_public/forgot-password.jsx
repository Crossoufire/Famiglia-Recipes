import {toast} from "sonner";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {PageTitle} from "@/components/app/PageTitle";
import {FormButton} from "@/components/app/FormButton";
import {useMutations} from "@famiglia-recipes/api/src";
import {createFileRoute, useNavigate} from "@tanstack/react-router";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";


// noinspection JSCheckFunctionSignatures,JSUnusedGlobalSymbols
export const Route = createFileRoute("/_public/forgot-password")({
    component: ForgotPasswordPage,
});


function ForgotPasswordPage() {
    const navigate = useNavigate();
    const { forgotPassword } = useMutations();
    const form = useForm({ defaultValues: { email: "" } });

    const onSubmit = (data) => {
        forgotPassword.mutate({ email: data.email, callback: import.meta.env.VITE_RESET_PASSWORD_CALLBACK }, {
            onError: (error) => toast.error(error?.description ?? "An error occurred sending your reset password email"),
            onSuccess: async () => {
                form.reset();
                toast.success("An email was sent to reset your password");
                await navigate({ to: "/" });
            },
        });
    };

    return (
        <PageTitle title="Forgot Password" subtitle="Enter the email associated with your account to reset your password">
            <div className="mt-4 max-w-[300px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            rules={{ required: "Email is required" }}
                            render={({ field }) =>
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="john.doe@example.com"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            }
                        />
                        <FormButton disabled={forgotPassword.isPending || form.formState.isSubmitting}>
                            Submit
                        </FormButton>
                    </form>
                </Form>
            </div>
        </PageTitle>
    );
}