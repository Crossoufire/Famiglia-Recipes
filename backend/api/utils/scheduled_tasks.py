import json
import os
from datetime import datetime
import click
from flask import current_app
from sqlalchemy import func
from backend.api import db
from backend.api.models import Recipe, User


# {
#     "image": "",
#     "title": str,
#     "cooking_time": int,
#     "prep_time": int,
#     "servings": int,
#     "comment": str,
#     "ingredients": [
#         {
#             "ingredient": str,
#             "proportion": int,
#         },
#     ],
#     "steps": [
#         {
#             "description": str,
#         },
#     ],
# }


def add_recipes_for_testing():
    current_user = User.query.get(1)

    with open(os.path.join(current_app.root_path, "static/recipes.json")) as fp:
        recipes_data = json.load(fp)

    for recipe in recipes_data:
        max_id = db.session.query(func.max(Recipe.id)).first()[0] or 1

        # noinspection PyArgumentList
        new_recipe = Recipe(
            id=max_id + 1,
            image=recipe["image"] or "default.png",
            title=recipe["title"],
            cooking_time=recipe["cooking_time"],
            prep_time=recipe["prep_time"],
            servings=recipe["servings"],
            comment=recipe.get("comment"),
            ingredients=json.dumps(recipe["ingredients"]),
            steps=json.dumps(recipe["steps"]),
            submitter_id=current_user.id,
            submitter=current_user,
            submitted_date=datetime.utcnow(),
        )
        db.session.add(new_recipe)
    db.session.commit()


def add_cli_commands():
    """ Register the command for the Flask CLI """

    @current_app.cli.command()
    def add_recipes():
        """ Add recipes for testing """

        add_recipes_for_testing()
        click.echo("Test recipes added successfully.")
