import {Toaster as Sonner} from "sonner";
import {useTheme} from "@/providers/ThemeProvider";


const Toaster = ({ ...props }) => {
    const value = useTheme();

    return (
        <Sonner
            duration={4000}
            closeButton={false}
            theme={value.theme}
            {...props}
        />
    );
};


export {Toaster};
