import {toast} from "sonner";
import {useForm} from "react-hook-form";
import {LoaderCircle} from "lucide-react";
import {useTranslation} from "react-i18next";
import {Input} from "~/lib/components/ui/input";
import authClient from "~/lib/utils/auth-client";
import {Button} from "~/lib/components/ui/button";
import {PageTitle} from "~/lib/components/app/PageTitle";
import {createFileRoute, useNavigate} from "@tanstack/react-router";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "~/lib/components/ui/form";


export const Route = createFileRoute("/_public/reset-password")({
    validateSearch: (search) => search as { token: string },
    loaderDeps: ({ search }) => ({ search }),
    component: ResetPasswordPage,
});


type FormValues = {
    newPassword: string,
    confirmPassword: string,
}


function ResetPasswordPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { token } = Route.useSearch();
    const form = useForm<FormValues>({
        defaultValues: {
            newPassword: "",
            confirmPassword: ""
        }
    });

    const onSubmit = async (submitted: FormValues) => {
        if (!token) {
            toast.error(t("invalid-token"));
            return navigate({ to: "/", replace: true });
        }

        await authClient.resetPassword({
            token: token,
            newPassword: submitted.newPassword,
        }, {
            onError: () => {
                toast.error(t("unexpected-error"));
            },
            onSuccess: async () => {
                form.reset();
                toast.success(t("success-pass-modified"));
                await navigate({ to: "/", replace: true });
            }
        });
    };

    return (
        <PageTitle title={t("rp-title")} subtitle={t("rp-subtitle")}>
            <div className="mt-4 w-[300px] max-sm:w-full">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <fieldset disabled={form.formState.isSubmitting}>
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="newPassword"
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
                                    name="confirmPassword"
                                    rules={{
                                        required: "The password confirmation is required.",
                                        validate: (val) => {
                                            if (form.watch("newPassword") !== val) return "The passwords do not match.";
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
                        </fieldset>
                        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting && <LoaderCircle className="size-4 animate-spin"/>} {t("submit")}
                        </Button>
                    </form>
                </Form>
            </div>
        </PageTitle>
    );
}
