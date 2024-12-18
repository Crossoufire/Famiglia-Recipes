import {Link} from "@tanstack/react-router";
import {Badge} from "@/components/ui/badge";
import {ChefHat, Clock} from "lucide-react";
import {Card, CardFooter, CardHeader} from "@/components/ui/card";


export const RecipeCard = ({ recipe }) => {
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
                    <CardHeader className="space-y-3 -mt-1">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-amber-600"/>
                                <span>Prep: {recipe.prep_time} min</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <ChefHat className="h-4 w-4 text-amber-600"/>
                                <span>Cook: {recipe.cooking_time} min</span>
                            </div>
                        </div>
                        <div className="space-y-0.5">
                            <h2 className="text-2xl font-bold tracking-tight line-clamp-2" title={recipe.title}>
                                {recipe.title}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Added by <b>{recipe.submitter.username}</b> on {recipe.submitted_date}
                            </p>
                        </div>
                    </CardHeader>
                    <CardFooter className="mt-auto pb-4">
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


// export const RecipeCard = ({ recipe }) => {
//     return (
//         <Link to={`/details/${recipe.id}`}>
//             <div className="bg-card rounded-md p-4 h-full space-y-4">
//                 <img
//                     alt="recipe-cover"
//                     src={recipe.cover_image}
//                     className="w-full h-[180px] rounded-md object-cover"
//                 />
//                 <div>
//                     <div className="text-xl font-medium line-clamp-1" title={recipe.title}>
//                         {recipe.title}
//                     </div>
//                     <cite className="italic text-muted-foreground mt-2 mb-0 text-sm">
//                         Added by <b>{recipe.submitter.username}</b> the {recipe.submitted_date}
//                     </cite>
//                     <Separator/>
//                 </div>
//                 <div className="flex flex-col gap-4 mt-3">
//                     <div className="flex justify-between">
//                         <Badge variant="secondary">
//                             Prep. {recipe.prep_time} min
//                         </Badge>
//                         <Badge variant="secondary">
//                             Cooking: {recipe.cooking_time} min
//                         </Badge>
//                     </div>
//
//                     <div>
//                         <div className="flex flex-wrap justify-start gap-2 mt-3">
//                             {recipe.labels.map(label =>
//                                 <Badge key={label.id} variant="inactive" color={label.color}>
//                                     {label.name}
//                                 </Badge>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </Link>
//     );
// };
