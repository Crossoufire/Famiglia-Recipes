import {CircleAlert} from "lucide-react";
import {Link} from "@tanstack/react-router";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";


export const ErrorComponent = ({ statusCode = 404, message = "Looks like you're lost" }) => {
    const { t } = useTranslation();
    if (statusCode === 401) {
        message = t("unauthorized");
    }
    return (
        <div className="flex items-center justify-center mt-12">
            <div className="text-center px-4">
                <h1 className="text-4xl sm:text-6xl font-bold mb-4">
                    Oops! <span className="text-primary">{statusCode}</span>
                </h1>
                <p className="text-xl sm:text-2xl mb-8 text-muted-foreground">{message}</p>
                <div className="mb-8">
                    <CircleAlert className="h-24 w-24 sm:h-48 sm:w-48 mx-auto text-primary"/>
                </div>
                <Button asChild>
                    <Link to="/">{t("take-me-home")}</Link>
                </Button>
            </div>
        </div>
    );
};
