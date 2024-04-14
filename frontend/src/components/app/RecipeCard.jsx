import React from "react";
import {Link} from "react-router-dom";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";


export const RecipeCard = ({ recipe }) => {
	return (
		<div className="col-span-12 md:col-span-5 lg:col-span-3">
			<div className="bg-card rounded-md p-4 h-full">
				<div>
					<Link to={`/details/${recipe.id}`}>
						<h5 className="text-lg font-medium">{recipe.title}</h5>
					</Link>
					<cite className="italic text-muted-foreground mt-2 mb-0 text-sm">
						Added by {recipe.submitter.username} the {recipe.submitted_date}
					</cite>
					<Separator/>
				</div>
				<div className="flex flex-col gap-4 mt-3">
					<div className="flex justify-between">
						<Badge variant="secondary">
							Prep. {recipe.prep_time} min
						</Badge>
						<Badge variant="secondary">
							Cooking: {recipe.cooking_time} min
						</Badge>
					</div>
					<div className="flex items-center justify-center">
						<img
							src={recipe.cover_image}
							className="w-[200px] h-[200px]"
							alt="food"
						/>
					</div>
					<div>
						<h6 className="font-medium">Labels</h6>
						<Separator/>
						<div className="flex flex-wrap justify-start gap-3 mt-3">
							{recipe.labels.map(label =>
								<Badge variant="inactive" color={label.color}>
									{label.name}
								</Badge>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
