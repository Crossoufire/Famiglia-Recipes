import {Button} from "@/components/ui/button";
import {useAuth} from "@famiglia-recipes/api";
import {useQueryClient} from "@tanstack/react-query";
import {LayoutDashboard, LogOut, PlusCircle, Search} from "lucide-react";
import {Link as NavLink, useLocation, useNavigate, useRouter} from "@tanstack/react-router";
import {NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navTrigStyle} from "@/components/ui/navigation-menu";


export const Navbar = () => {
    const router = useRouter();
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const { currentUser, logout } = useAuth();

    const logoutUser = () => {
        logout.mutate(undefined, {
            onSuccess: async () => {
                queryClient.clear();
                // noinspection JSUnresolvedReference
                await router.invalidate().then(() => navigate({ to: "/" }));
            },
        });
    };

    // Login page and public pages when not logged
    if (!currentUser) {
        return (
            <nav className="w-screen z-50 flex items-center fixed top-0 h-16 border-b border-b-neutral-700 bg-background">
                <div className="md:max-w-screen-xl flex w-full justify-between items-center container">
                    <NavLink to="/" className="text-lg font-semibold">Famiglia-Recipes</NavLink>
                    {location.pathname !== "/" &&
                        <div className="space-x-3">
                            <Button size="sm" asChild>
                                <NavLink to="/">Login</NavLink>
                            </Button>
                            <Button size="sm" variant="secondary" asChild>
                                <NavLink to="/">Register</NavLink>
                            </Button>
                        </div>
                    }
                </div>
            </nav>
        );
    }

    return (
        <nav className="w-screen z-50 flex items-center fixed top-0 h-16 border-b border-b-neutral-700 bg-background">
            <div className="md:max-w-screen-xl flex w-full justify-between items-center container">
                <div className="hidden lg:block">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem className="mr-3">
                                <img src="/logo192.png" className="w-[28px] h-[28px]" alt="logo"/>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavLink to="/dashboard" className={navTrigStyle()}>
                                    Dashboard
                                </NavLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavLink to="/add-recipe" className={navTrigStyle()}>
                                    Add Recipe
                                </NavLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavLink to="/all-recipes" className={navTrigStyle()}>
                                    All Recipes
                                </NavLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                <div className="hidden lg:block">
                    <NavigationMenu>
                        <NavigationMenuItem className="flex items-center gap-4">
                            <p className="font-semibold">Bienvenue {currentUser.username}</p>
                            <div role="button" onClick={logoutUser} title="Logout">
                                <LogOut className="h-4 w-4"/>
                            </div>
                        </NavigationMenuItem>
                    </NavigationMenu>
                </div>
                <div className="lg:hidden mx-auto">
                    <NavigationMenu>
                        <NavigationMenuList className="gap-12">
                            <NavigationMenuItem>
                                <NavLink to="/dashboard" className={navTrigStyle()}>
                                    <LayoutDashboard className="h-4 w-4"/>
                                </NavLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavLink to="/add-recipe" className={navTrigStyle()}>
                                    <PlusCircle className="h-4 w-4"/>
                                </NavLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavLink to="/all-recipes" className={navTrigStyle()}>
                                    <Search className="h-4 w-4"/>
                                </NavLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink className={navTrigStyle()}>
                                    <div role="button" onClick={logoutUser}>
                                        <LogOut className="h-4 w-4"/>
                                    </div>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>
        </nav>
    );
};
