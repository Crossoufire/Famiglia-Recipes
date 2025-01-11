import {useTranslation} from "react-i18next";
import {PageTitle} from "@/components/app/PageTitle";
import {LoginForm} from "@/components/app/LoginForm";
import {createFileRoute} from "@tanstack/react-router";
import {RegisterForm} from "@/components/app/RegisterForm";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";


// noinspection JSCheckFunctionSignatures
export const Route = createFileRoute("/_public/")({
    component: HomePage,
});


function HomePage() {
    const { t } = useTranslation();

    return (
        <PageTitle title="HomePage" onlyHelmet>
            <div className="text-4xl md:text-5xl text-center font-semibold mb-12 mt-14">
                {t("welcome")}
            </div>
            <div className="flex flex-col items-center">
                <Tabs defaultValue="login" className="w-[350px] max-sm:w-full">
                    <TabsList className="bg-card grid w-full grid-cols-2 h-full">
                        <TabsTrigger value="login" className="text-lg">{t("login")}</TabsTrigger>
                        <TabsTrigger value="register" className="text-lg">{t("register")}</TabsTrigger>
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
}