import {PageTitle} from "@/components/app/PageTitle";
import {LoginForm} from "@/components/app/LoginForm";
import {RegisterForm} from "@/components/app/RegisterForm";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";


export const HomePage = () => {
	return (
		<PageTitle title="HomePage" onlyHelmet>
			<div className="text-4xl md:text-5xl text-center font-semibold mb-12 mt-14">Welcome to Famiglia Recipes</div>
			<div className="flex flex-col items-center">
				<Tabs defaultValue="login" className="w-[320px]">
					<TabsList className="bg-card grid w-full grid-cols-2 h-full">
						<TabsTrigger value="login" className="text-lg">Login</TabsTrigger>
						<TabsTrigger value="register" className="text-lg">Register</TabsTrigger>
					</TabsList>
					<TabsContent value="login">
						<LoginForm/>
					</TabsContent>
					<TabsContent value="register">
						<RegisterForm/>
					</TabsContent>
				</Tabs>
			</div>
		</PageTitle>
	);
};
