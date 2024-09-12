import {NavLink} from "react-router-dom";
import {Tooltip} from "@/components/ui/tooltip";
import {useUser} from "@/providers/UserProvider";
import {Loading} from "@/components/app/Loading";
import * as Nav from "@/components/ui/navigation-menu";
import {FaArrowRightFromBracket, FaMagnifyingGlass, FaPlus, FaTableCellsLarge} from "react-icons/fa6";


export const Navbar = () => {
    const { currentUser, logout } = useUser();

    // Login page and public pages
    if (currentUser === null) {
        return (
            <nav className="z-50 fixed top-0 w-full h-16 border-b flex items-center bg-background border-b-neutral-700">
                <div className="md:max-w-screen-xl flex w-full justify-between items-center mx-auto container">
                    <Nav.NavigationMenu>
                        <Nav.NavigationMenuList>
                            <Nav.NavigationMenuItem className="flex items-center gap-3">
                                <img
                                    width={35}
                                    height={35}
                                    src="/logo192.png"
                                    alt="Famiglia-Recipes"
                                />
                                <p className="text-lg font-semibold mr-2">Famiglia-Recipes</p>
                            </Nav.NavigationMenuItem>
                        </Nav.NavigationMenuList>
                    </Nav.NavigationMenu>
                </div>
            </nav>
        );
    }

    return (
        <nav className="z-50 fixed top-0 w-full h-16 border-b flex items-center bg-background border-b-neutral-700">
            <div className="md:max-w-screen-xl flex w-full justify-between max-sm:justify-around items-center mx-auto container">
                {currentUser === undefined ?
                    <Loading forPage={false}/>
                    :
                    <>
                        <div className="hidden lg:block">
                            <Nav.NavigationMenu>
                                <Nav.NavigationMenuList>
                                    <Nav.NavigationMenuItem className="mr-3">
                                        <img
                                            src="/logo192.png"
                                            height={35}
                                            width={35}
                                            alt="Famiglia-Recipes"
                                        />
                                    </Nav.NavigationMenuItem>
                                    <Nav.NavigationMenuItem>
                                        <NavLink to="/dashboard" className={Nav.navigationMenuTriggerStyle()}>
                                            Dashboard
                                        </NavLink>
                                    </Nav.NavigationMenuItem>
                                    <Nav.NavigationMenuItem>
                                        <NavLink to="/add_recipe" className={Nav.navigationMenuTriggerStyle()}>
                                            Add Recipe
                                        </NavLink>
                                    </Nav.NavigationMenuItem>
                                    <Nav.NavigationMenuItem>
                                        <NavLink to="/all_recipes" className={Nav.navigationMenuTriggerStyle()}>
                                            All Recipes
                                        </NavLink>
                                    </Nav.NavigationMenuItem>
                                </Nav.NavigationMenuList>
                            </Nav.NavigationMenu>
                        </div>
                        <div className="hidden lg:block">
                            <Nav.NavigationMenu>
                                <Nav.NavigationMenuList className="gap-4">
                                    <Nav.NavigationMenuItem>
                                        <p className="font-semibold">Bienvenue {currentUser.username}</p>
                                    </Nav.NavigationMenuItem>
                                    <Nav.NavigationMenuItem>
                                        <Tooltip text="Logout">
                                            <div role="button" onClick={logout}>
                                                <FaArrowRightFromBracket/>
                                            </div>
                                        </Tooltip>
                                    </Nav.NavigationMenuItem>
                                </Nav.NavigationMenuList>
                            </Nav.NavigationMenu>
                        </div>
                        <div className="lg:hidden">
                            <Nav.NavigationMenu>
                                <Nav.NavigationMenuList className="flex items-center justify-between gap-10">
                                    <Nav.NavigationMenuItem>
                                        <NavLink to="/dashboard" className={Nav.navigationMenuTriggerStyle()}>
                                            <FaTableCellsLarge/>
                                        </NavLink>
                                    </Nav.NavigationMenuItem>
                                    <Nav.NavigationMenuItem>
                                        <NavLink to="/add_recipe" className={Nav.navigationMenuTriggerStyle()}>
                                            <FaPlus/>
                                        </NavLink>
                                    </Nav.NavigationMenuItem>
                                    <Nav.NavigationMenuItem>
                                        <NavLink to="/all_recipes" className={Nav.navigationMenuTriggerStyle()}>
                                            <FaMagnifyingGlass/>
                                        </NavLink>
                                    </Nav.NavigationMenuItem>
                                    <Nav.NavigationMenuItem>
                                        <Nav.NavigationMenuLink className={Nav.navigationMenuTriggerStyle()}>
                                            <div role="button" onClick={logout}>
                                                <FaArrowRightFromBracket/>
                                            </div>
                                        </Nav.NavigationMenuLink>
                                    </Nav.NavigationMenuItem>
                                </Nav.NavigationMenuList>
                            </Nav.NavigationMenu>
                        </div>
                    </>
                }
            </div>
        </nav>
    );
};
