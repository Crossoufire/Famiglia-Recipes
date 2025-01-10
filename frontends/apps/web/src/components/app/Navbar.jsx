import {useState} from "react";
import {cn} from "@/lib/utils";
import {router} from "@/router";
import {Button} from "@/components/ui/button";
import {useAuth} from "@famiglia-recipes/api";
import {Book, ChefHat, LogOut, Menu, Plus, X} from "lucide-react";
import {Link as NavLink, useLocation, useNavigate} from "@tanstack/react-router";


export const Navbar = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { currentUser, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: "Dashboard", to: "/dashboard", icon: ChefHat },
        { name: "Add Recipe", to: "/add-recipe", icon: Plus },
        { name: "All Recipes", to: "/all-recipes", icon: Book },
    ];

    const logoutUser = () => {
        logout.mutate(undefined, {
            onSuccess: async () => {
                setIsMobileMenuOpen(false);
                await router.invalidate().then(async () => {
                    // noinspection JSCheckFunctionSignatures
                    return navigate({ to: "/" });
                });
            },
        });
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // Login page and public pages when not logged
    if (!currentUser) {
        return (
            <nav className="w-screen z-50 flex items-center fixed top-0 h-16 border-b bg-neutral-950 border-b-neutral-700 bg-background">
                <div className="md:max-w-screen-xl flex w-full justify-between items-center container">
                    <NavLink to="/" className="text-lg font-semibold">Famiglia-Recipes</NavLink>
                    {pathname !== "/" &&
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
        <nav className="w-screen z-50 fixed top-0 border-b border-neutral-700 bg-neutral-950">
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <img alt="logo" src="/logo192.png" className="w-[28px] h-[28px]"/>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-8 flex items-baseline space-x-4">
                                {navItems.map(item =>
                                    <NavLink key={item.name} to={item.to} className={cn(
                                        "px-3 py-2 rounded-md text-sm font-medium flex items-center", pathname === item.to ?
                                            "bg-gray-800" : "hover:bg-gray-700")}>
                                        <item.icon className="h-4 w-4 mr-2"/>
                                        {item.name}
                                    </NavLink>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            <span className="text-gray-300 font-medium mr-4">Bienvenue {currentUser.username}</span>
                            <Button variant="ghost" size="icon" onClick={logoutUser}>
                                <LogOut className="h-5 w-5"/>
                                <span className="sr-only">Logout</span>
                            </Button>
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? <X className="block h-6 w-6"/> : <Menu className="block h-6 w-6"/>}
                        </Button>
                    </div>
                </div>
            </div>

            {isMobileMenuOpen &&
                <div className="md:hidden bg-neutral-950">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map(item =>
                            <NavLink key={item.name} to={item.to} className={cn(
                                "px-3 py-2 rounded-md text-base font-medium flex items-center", pathname === item.to ?
                                    "bg-gray-800" : "hover:bg-gray-700")} onClick={closeMobileMenu}>
                                <item.icon className="h-4 w-4 mr-2"/>
                                {item.name}
                            </NavLink>
                        )}
                    </div>
                    <div className="pt-2 pb-2 border-t border-gray-700">
                        <div className="flex items-center px-5">
                            <div className="ml-3">
                                <div className="text-base font-medium leading-none">
                                    {currentUser.username}
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="ml-auto" onClick={logoutUser}>
                                <LogOut className="h-5 w-5"/>
                                <span className="sr-only">Logout</span>
                            </Button>
                        </div>
                    </div>
                </div>
            }
        </nav>
    );
};
