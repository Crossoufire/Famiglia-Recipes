import {cn} from "@/lib/utils.js";
import {Button} from "@/components/ui/button.jsx";
import {LoadingIcon} from "@/components/app/LoadingIcon.jsx";


export const FormButton = ({ children, size = 8, className, pending, ...props }) => {
    return (
        <Button type="submit" className={cn("w-full", className)} disabled={pending} {...props}>
            {pending ? <LoadingIcon size={size}/> : children}
        </Button>
    );
};

