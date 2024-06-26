import {toast} from "sonner";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {useUser} from "@/providers/UserProvider";
import {Link, useNavigate} from "react-router-dom";
import {FormError} from "@/components/app/FormError";
import {FormButton} from "@/components/app/FormButton";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";


export const LoginForm = () => {
	const { login } = useUser();
	const navigate = useNavigate();
	const [errors, setErrors] = useState("");
	const form = useForm({ shouldFocusError: false });
	const [pending, setIsPending] = useState(false);

	const onSubmit = async (data) => {
		setErrors("");

		try {
			setIsPending(true);
			const response = await login(data.username, data.password);

			if (response.status === 401) {
				return setErrors("Username or password incorrect");
			}

			if (!response.ok) {
				return toast.error(response.body.description);
			}

			navigate(`/dashboard`);
		}
		finally {
			setIsPending(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex justify-center">
					Welcome back!
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<div className="space-y-2">
							<FormField
								control={form.control}
								name="username"
								rules={{required: "Please enter a valid username"}}
								render={({ field }) => (
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
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								rules={{required: "This field is required"}}
								render={({ field }) => (
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
								)}
							/>
						</div>
						{errors && <FormError message={errors}/>}
						<FormButton pending={pending}>
							Login
						</FormButton>
					</form>
				</Form>
				<Link to="/forgot_password" className="text-blue-500">
					<div className="mt-4">Forgot password?</div>
				</Link>
			</CardContent>
		</Card>
	);
};
