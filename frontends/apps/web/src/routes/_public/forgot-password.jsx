import {toast} from "sonner";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {useTranslation} from "react-i18next";
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
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { forgotPassword } = useMutations();
    const form = useForm({ defaultValues: { email: "" } });

    const onSubmit = (data) => {
        forgotPassword.mutate({ email: data.email, callback: import.meta.env.VITE_RESET_PASSWORD_CALLBACK }, {
            onError: (error) => toast.error(error?.description ?? t("unexpected-error")),
            onSuccess: async () => {
                form.reset();
                toast.success(t("success-reset-email"));
                await navigate({ to: "/" });
            },
        });
    };

    return (
        <PageTitle title={t("fp-title")} subtitle={t("fp-subtitle")}>
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
                            {t("submit")}
                        </FormButton>
                    </form>
                </Form>
            </div>
        </PageTitle>
    );
}