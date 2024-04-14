import {toast} from "sonner";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input.jsx";
import {useApi} from "@/providers/ApiProvider.jsx";
import {FormError} from "@/components/app/FormError.jsx";
import {FormButton} from "@/components/app/FormButton.jsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.jsx";


export const RegisterForm = () => {
	const api = useApi()
	const [errors, setErrors] = useState({});
	const [pending, setPending] = useState(false);
	const form = useForm({ shouldFocusError: false });

	const onSubmit = async (data) => {
		setErrors({})

		setPending(true);
		const response = await api.post("/register_user", {
			username: data.username,
			email: data.email,
			password: data.password,
			registerKey: data.registerKey,
		});
		setPending(false);

		if (response.status === 401) {
			return setErrors(response.body.description);
		}

		if (!response.ok) {
			return toast.error(response.body.description);
		}

		toast.success(response.body.message);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex justify-center">
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
									required: "Username is required",
									minLength: {value: 3, message: "The username is too short (3 min)"},
									maxLength: {value: 15, message: "The username is too long (15 max)"},
								}}
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
							{errors?.username && <FormError message={errors.username}/>}
							<FormField
								control={form.control}
								name="email"
								rules={{ required: "Email is required" }}
								render={({ field }) => (
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
								)}
							/>
							{errors?.email && <FormError message={errors.email}/>}
							<FormField
								control={form.control}
								name="password"
								rules={{
									required: "Password is required",
									minLength: {value: 8, message: "The password must have at least 8 characters"},
								}}
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
							{errors?.password && <FormError message={errors.password}/>}
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
								render={({ field }) => (
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
								)}
							/>
							<FormField
								control={form.control}
								name="registerKey"
								rules={{ required: "The register key is required" }}
								render={({ field }) => (
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
								)}
							/>
							{errors?.registerKey && <FormError message={errors.registerKey}/>}
						</div>
						<FormButton pending={pending}>
							Create your account
						</FormButton>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
