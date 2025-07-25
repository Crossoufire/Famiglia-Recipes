import {useTranslation} from "react-i18next";
import {CookingPot, Search, Star} from "lucide-react";
import {createFileRoute} from "@tanstack/react-router";
import {Separator} from "~/lib/components/ui/separator";
import {LoginForm} from "~/lib/components/app/LoginForm";
import {PageTitle} from "~/lib/components/app/PageTitle";
import {Card, CardContent} from "~/lib/components/ui/card";
import {RegisterForm} from "~/lib/components/app/RegisterForm";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "~/lib/components/ui/tabs";


export const Route = createFileRoute("/_public/")({
    component: HomePage,
});


function HomePage() {
    const { t } = useTranslation();

    return (
        <PageTitle title="Home" onlyHelmet>
            <div className="flex flex-col items-center min-h-screen">
                <div className="w-full max-w-7xl px-4 mx-auto mt-10 mb-16 text-center">
                    <div className="flex justify-center mb-6">
                        <img src="/logo192.png" alt="Famiglia Recipes Logo" className="h-24 w-24"/>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        {t("welcome")}
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        {t("hero-title")}
                    </p>
                    <Separator className="max-w-md mx-auto"/>
                </div>

                <div className="w-full max-w-7xl px-4 mx-auto mb-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <Card className="bg-card/60 backdrop-blur border border-muted">
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <div className="text-3xl font-bold mb-3">
                                    <CookingPot className="h-8 w-8 text-cyan-600"/>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{t("add-recipes")}</h3>
                                <p className="text-muted-foreground">
                                    {t("feature-1-title")}
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/60 backdrop-blur border border-muted">
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <div className="text-3xl font-bold mb-3">
                                    <Star className="h-8 w-8 text-amber-500"/>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{t("fav-recipes")}</h3>
                                <p className="text-muted-foreground">
                                    {t("feature-2-title")}
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/60 backdrop-blur border border-muted">
                            <CardContent className="p-6 flex flex-col items-center text-center">
                                <div className="text-3xl font-bold mb-3">
                                    <Search className="h-8 w-8 text-teal-600"/>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{t("search-recipes")}</h3>
                                <p className="text-muted-foreground">
                                    {t("feature-3-title")}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="w-full max-w-2xl px-4 mx-auto mb-20">
                    <Card className="max-w-sm mx-auto bg-card/60 backdrop-blur border border-muted">
                        <CardContent className="p-6">
                            <h2 className="text-2xl font-semibold text-center mb-6">{t("welcome-back")}</h2>
                            <Tabs defaultValue="login" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 h-full mb-4">
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageTitle>
    );
}
