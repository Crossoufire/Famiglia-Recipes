import {toast} from "sonner";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {useAuth} from "@famiglia-recipes/api";
import {FormButton} from "@/components/app/FormButton";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";


export const RegisterForm = () => {
    const { register } = useAuth();
    const form = useForm({
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            registerKey: "",
        },
        shouldFocusError: false,
    });

    const onSubmit = async (data) => {
        const dataToSend = {
            email: data.email,
            username: data.username,
            password: data.password,
            register_key: data.registerKey,
            callback: import.meta.env.VITE_REGISTER_CALLBACK,
        };

        register.mutate({ data: dataToSend }, {
            onError: (error) => toast.error(error?.description ?? "An error occurred while creating your account"),
            onSuccess: () => {
                form.reset();
                toast.success("Your account has been created. You can now log-in.");
            },
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-center text-lg">
                    Create an account
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="username"
                                rules={{
                                    required: "A username is required",
                                    minLength: { value: 3, message: "The username is too short (3 min)" },
                                    maxLength: { value: 15, message: "The username is too long (15 max)" },
                                }}
                                render={({ field }) =>
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
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
                                name="email"
                                rules={{ required: "An email is required" }}
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
                            <FormField
                                control={form.control}
                                name="password"
                                rules={{
                                    required: "A password is required",
                                    minLength: { value: 8, message: "The password must have at least 8 characters" },
                                }}
                                render={({ field }) =>
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
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
                                    validate: (val) => {
                                        // noinspection JSCheckFunctionSignatures
                                        if (form.watch("password") !== val) {
                                            return "The passwords do not match";
                                        }
                                    }
                                }}
                                render={({ field }) =>
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
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
                                name="registerKey"
                                rules={{ required: "The register key is required" }}
                                render={({ field }) =>
                                    <FormItem>
                                        <FormLabel>Register Key</FormLabel>
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
                        <FormButton disabled={register.isPending || form.formState.isSubmitting}>
                            Create your account
                        </FormButton>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};
