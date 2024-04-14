import {Link} from "react-router-dom";
import {Tooltip} from "@/components/ui/tooltip";
import {useUser} from "@/providers/UserProvider";
import {Loading} from "@/components/app/Loading.jsx";
import {FaPlus, FaMagnifyingGlass, FaArrowRightFromBracket} from "react-icons/fa6";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";


export const Navbar = () => {
    const { currentUser, logout } = useUser();

    // Login page and public pages
    if (currentUser === null) {
        return (
            <nav className="z-50 fixed top-0 w-full h-16 border-b shadow-sm flex items-center bg-gray-900 border-b-neutral-500">
                <div className="md:max-w-screen-xl flex w-full justify-between items-center mx-auto container">
                    <div className="hidden lg:block">
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <p className="text-lg font-semibold mr-2">FamigliaRecipes</p>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="z-50 fixed top-0 w-full h-16 border-b shadow-sm flex items-center bg-gray-900 border-b-neutral-500">
            <div className="md:max-w-screen-xl flex w-full justify-between max-sm:justify-around items-center mx-auto container">
                {currentUser === undefined ?
                    <Loading forPage={false}/>
                    :
                    <>
                        <div className="hidden lg:block">
                            <NavigationMenu>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <Link to="/dashboard">
                                            <p className="text-lg font-semibold mr-2">FamigliaRecipes</p>
                                        </Link>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <Link to="/add_recipe">
                                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                                Add Recipe
                                            </NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <Link to="/search_recipe">
                                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                                Search Recipe
                                            </NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                        <div className="hidden lg:block">
                            <NavigationMenu>
                                <NavigationMenuList className="gap-4">
                                    <NavigationMenuItem>
                                        <p className="font-semibold">Bienvenue {currentUser.username}</p>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <Tooltip text="Logout">
                                            <div role="button" onClick={logout}>
                                                <FaArrowRightFromBracket/>
                                            </div>
                                        </Tooltip>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                        <div className="lg:hidden">
                            <NavigationMenu>
                                <NavigationMenuList className="gap-3">
                                    <NavigationMenuItem>
                                        <Link to="/dashboard">
                                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                                <p className="text-lg font-semibold">Dashboard</p>
                                            </NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <Link to="/add_recipe">
                                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                                <FaPlus/>
                                            </NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <Link to="/search_recipe">
                                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                                <FaMagnifyingGlass/>
                                            </NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                            <div role="button" onClick={logout}>
                                                <FaArrowRightFromBracket/>
                                            </div>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                    </>
                }
            </div>
        </nav>
    );
};
