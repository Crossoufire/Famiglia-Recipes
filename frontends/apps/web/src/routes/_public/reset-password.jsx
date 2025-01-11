import {toast} from "sonner";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";
import {PageTitle} from "@/components/app/PageTitle";
import {useMutations} from "@famiglia-recipes/api/src/mutations";
import {createFileRoute, useNavigate} from "@tanstack/react-router";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";


// noinspection JSCheckFunctionSignatures,JSUnusedGlobalSymbols
export const Route = createFileRoute("/_public/reset-password")({
    component: ResetPasswordPage,
});


function ResetPasswordPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { token } = Route.useSearch();
    const { resetPassword } = useMutations();
    const form = useForm({ defaultValues: { new_password: "", confirm_password: "" } });

    const onSubmit = (data) => {
        resetPassword.mutate({ token, new_password: data.new_password }, {
            onError: (error) => toast.error(error?.description ?? t("invalid-token")),
            onSuccess: async () => {
                toast.success(t("success-pass-modified"));
                await navigate({ to: "/" });
            },
            onSettled: () => form.reset(),
        });
    };

    return (
        <PageTitle title={t("rp-title")} subtitle={t("rp-subtitle")}>
            <div className="mt-4 w-[300px] max-sm:w-full">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="new_password"
                                rules={{
                                    required: "The password is required.",
                                    minLength: { value: 8, message: "The password must have at least 8 characters." },
                                }}
                                render={({ field }) =>
                                    <FormItem>
                                        <FormLabel>{t("password")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="password"
                                                placeholder="********"
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                }
                            />
                            <FormField
                                control={form.control}
                                name="confirm_password"
                                rules={{
                                    required: "The password confirmation is required.",
                                    validate: (val) => {
                                        // noinspection JSCheckFunctionSignatures
                                        if (form.watch("new_password") !== val) {
                                            return "The passwords do not match.";
                                        }
                                    }
                                }}
                                render={({ field }) =>
                                    <FormItem>
                                        <FormLabel>{t("confirm-password")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="password"
                                                placeholder="********"
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                }
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={resetPassword.isPending || form.formState.isSubmitting}>
                            {t("submit")}
                        </Button>
                    </form>
                </Form>
            </div>
        </PageTitle>
    );
}
