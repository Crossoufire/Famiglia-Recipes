import {LuMoon, LuSun} from "react-icons/lu";
import {Button} from "@/components/ui/button";
import {useTheme} from "@/providers/ThemeProvider";
import * as Drop from "@/components/ui/dropdown-menu";


export const ThemeToggler = () => {
    const { setTheme } = useTheme();

    return (
        <Drop.DropdownMenu>
            <Drop.DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <LuSun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/>
                    <LuMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"/>
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </Drop.DropdownMenuTrigger>
            <Drop.DropdownMenuContent align="end">
                <Drop.DropdownMenuItem onClick={() => setTheme("light")}>Light</Drop.DropdownMenuItem>
                <Drop.DropdownMenuItem onClick={() => setTheme("dark")}>Dark</Drop.DropdownMenuItem>
                <Drop.DropdownMenuItem onClick={() => setTheme("system")}>System</Drop.DropdownMenuItem>
            </Drop.DropdownMenuContent>
        </Drop.DropdownMenu>
    )
};
