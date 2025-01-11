import {toast} from "sonner";
import {useLayoutEffect} from "react";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {useTranslation} from "react-i18next";
import {useAuth} from "@famiglia-recipes/api";
import {FormButton} from "@/components/app/FormButton";
import {Link, useNavigate, useRouter} from "@tanstack/react-router";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";


export const LoginForm = () => {
    const router = useRouter();
    const { login } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const form = useForm({ defaultValues: { username: "", password: "" }, shouldFocusError: false });

    useLayoutEffect(() => {
        if (!currentUser) return;
        // noinspection JSUnresolvedReference
        void router.invalidate();
        void navigate({ to: "/dashboard" });
    }, [currentUser]);

    const onSubmit = (data) => {
        login.mutate(data, {
            onError: (error) => {
                if (error.status === 401) {
                    form.setError("username", { type: "manual", message: t("login-error") });
                    form.setError("password", { type: "manual", message: t("login-error") });
                    return;
                }
                toast.error(t("unexpected-error"));
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-center text-lg">
                    {t("welcome-back")}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="username"
                                rules={{ required: "Please enter a valid username" }}
                                render={({ field }) =>
                                    <FormItem>
                                        <FormLabel>{t("username")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Username"
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                }
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                rules={{ required: "This field is required" }}
                                render={({ field }) =>
                                    <FormItem>
                                        <div className="flex items-center justify-between">
                                            <FormLabel>{t("password")}</FormLabel>
                                            <Link to="/forgot-password" className="text-sm underline" tabIndex={-1}>
                                                {t("forgot-password")}
                                            </Link>
                                        </div>
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
                        <FormButton disabled={login.isPending}>
                            {t("login")}
                        </FormButton>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};
