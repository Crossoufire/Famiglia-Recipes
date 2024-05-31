import {SWRConfig} from "swr";
import {HomePage} from "@/pages/HomePage";
import {ErrorPage} from "@/pages/ErrorPage";
import {Toaster} from "@/components/ui/sonner";
import {Footer} from "@/components/app/Footer";
import {DetailsPage} from "@/pages/DetailsPage";
import {Navbar} from "@/components/app/Navbar.jsx";
import {DashboardPage} from "@/pages/DashboardPage";
import {AddRecipePage} from "@/pages/AddRecipePage";
import {ApiProvider} from "@/providers/ApiProvider";
import {EditRecipePage} from "@/pages/EditRepicePage";
import {UserProvider} from "@/providers/UserProvider";
import {ThemeProvider} from "@/providers/ThemeProvider";
import {PublicRoute} from "@/components/app/PublicRoute";
import {AllRecipesPage} from "@/pages/AllRecipesPage.jsx";
import {ResetPasswordPage} from "@/pages/ResetPasswordPage";
import {PrivateRoute, } from "@/components/app/PrivateRoute";
import {ForgotPasswordPage} from "@/pages/ForgotPasswordPage";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import "./index.css";


export const App = () => {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<BrowserRouter>
				<ApiProvider>
					<UserProvider>
						<SWRConfig>
							<Toaster position="bottom-right"/>
							<Navbar/>
							<main className="md:max-w-screen-xl container max-sm:px-4">
								<Routes>
									<Route path="/" element={<PublicRoute><HomePage/></PublicRoute>}/>
									<Route path="/forgot_password"
										   element={<PublicRoute><ForgotPasswordPage/></PublicRoute>}/>
									<Route path="/reset_password"
										   element={<PublicRoute><ResetPasswordPage/></PublicRoute>}/>
									<Route path="*" element={<PrivateRoute><PrivateRoutes/></PrivateRoute>}/>
								</Routes>
							</main>
							<Footer/>
						</SWRConfig>
					</UserProvider>
				</ApiProvider>
			</BrowserRouter>
		</ThemeProvider>
	);
};


const PrivateRoutes = () => {
	return (
		<Routes>
			<Route path="/details/:recipeId" element={<DetailsPage/>}/>
			<Route path="/add_recipe" element={<AddRecipePage/>}/>
			<Route path="/edit_recipe/:recipeId" element={<EditRecipePage/>}/>
			<Route path="/all_recipes" element={<AllRecipesPage/>}/>
			<Route path="/dashboard" element={<DashboardPage/>}/>
			<Route path="*" element={<ErrorPage/>}/>
		</Routes>
	);
}
