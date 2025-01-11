import {Link} from "@tanstack/react-router";
import {Badge} from "@/components/ui/badge";
import {ChefHat, Clock} from "lucide-react";
import {useTranslation} from "react-i18next";
import {Card, CardFooter, CardHeader} from "@/components/ui/card";


export const RecipeCard = ({ recipe }) => {
    const { t } = useTranslation();

    return (
        <Link to={`/details/${recipe.id}`}>
            <Card className="flex flex-col group h-full rounded-lg">
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
                    <img
                        alt={recipe.title}
                        src={recipe.cover_image}
                        className="object-cover bg-slate-700 transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
                <div className="flex flex-col flex-grow">
                    <CardHeader className="space-y-3 -mt-1 max-lg:px-4">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-amber-600"/>
                                <span>Prep: {recipe.prep_time} min</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <ChefHat className="h-4 w-4 text-amber-600"/>
                                <span>{t("cook")}: {recipe.cooking_time} min</span>
                            </div>
                        </div>
                        <div className="space-y-0.5">
                            <h2 className="text-2xl max-lg:text-xl font-bold tracking-tight line-clamp-2" title={recipe.title}>
                                {recipe.title}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                <b>{recipe.submitter.username}</b> - {t("submit-date", { date: recipe.submitted_date })}
                            </p>
                        </div>
                    </CardHeader>
                    <CardFooter className="mt-auto pb-4 max-lg:px-4">
                        <div className="flex flex-wrap gap-2">
                            {recipe.labels.map(label =>
                                <Badge key={label.id} variant="inactive" color={label.color}>
                                    {label.name}
                                </Badge>
                            )}
                        </div>
                    </CardFooter>
                </div>
            </Card>
        </Link>
    );
};
