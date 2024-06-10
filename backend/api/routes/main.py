import json
from datetime import datetime
from flask import request, abort, jsonify, Blueprint, current_app
from backend.api import db
from backend.api.models import Recipe, Label
from backend.api.routes.handlers import token_auth, current_user
from backend.api.utils.helper import save_picture

main_bp = Blueprint("main", __name__)


@main_bp.route("/dashboard", methods=["GET"])
@token_auth.login_required
def dashboard():
    last_recipes = Recipe.query.order_by(Recipe.submitted_date.desc()).limit(8).all()

    data = dict(
        last_recipes=[recipe.to_dict() for recipe in last_recipes],
        favorite_recipes=[recipe.to_dict() for recipe in current_user.fav_recipes],
    )

    return jsonify(data=data), 200


@main_bp.route("/details/<recipe_id>", methods=["GET"])
@token_auth.login_required
def details(recipe_id: int):
    recipe = Recipe.query.filter_by(id=recipe_id).first()
    if not recipe:
        return abort(404)

    return jsonify(data=recipe.to_dict()), 200


@main_bp.route("/add_recipe", methods=["POST"])
@token_auth.login_required
def add_recipe():
    json_data = json.loads(request.form.get("recipe"))
    cover_image, cover_name = request.files.get("image"), None

    if cover_image:
        cover_name = save_picture(cover_image)
        if not cover_name:
            return abort(400, "The uploaded image was not accepted. Please choose another one.")

    ingredients = []
    for ingredient, proportion in zip(json_data["ingredients"], json_data["proportions"]):
        ingredients.append({"ingredient": ingredient["value"], "proportion": proportion["value"]})

    steps = []
    for step in json_data["steps"]:
        steps.append({"description": step["value"]})

    labels = Label.query.filter(Label.name.in_([label["value"] for label in json_data["labels"]])).all()

    # noinspection PyArgumentList
    new_recipe = Recipe(
        image=cover_name,
        title=json_data["title"],
        cooking_time=json_data["cooking"],
        prep_time=json_data["preparation"],
        servings=json_data["servings"],
        comment=json_data.get("comment"),
        ingredients=json.dumps(ingredients),
        steps=json.dumps(steps),
        submitter_id=current_user.id,
        submitter=current_user,
        submitted_date=datetime.utcnow(),
        labels=labels,
    )

    db.session.add(new_recipe)
    db.session.commit()

    return jsonify(data={"recipe_id": new_recipe.id}), 200


@main_bp.route("/update_favorite", methods=["POST"])
@token_auth.login_required
def update_favorite():
    try:
        recipe_id = request.get_json()["recipe_id"]
    except:
        return abort(400)

    recipe = Recipe.query.filter_by(id=recipe_id).first()
    if not recipe:
        return abort(404, "This recipe does not exists")

    current_user.update_fav(recipe)

    return {}, 204


@main_bp.route("/edit_recipe/<recipe_id>", methods=["GET"])
@token_auth.login_required
def get_recipe_for_edit(recipe_id: int):
    recipe = Recipe.query.filter_by(id=recipe_id).first()
    if not recipe:
        return abort(404)

    data = dict(
        fields={key: value for key, value in recipe.to_dict().items() if key in recipe.form_only()},
        labels=[label.to_dict() for label in Label.query.order_by(Label.order.asc()).all()],
    )

    return jsonify(data=data), 200


@main_bp.route("/edit_recipe/<recipe_id>", methods=["POST"])
@token_auth.login_required
def edit_recipe(recipe_id: int):
    recipe = Recipe.query.filter_by(id=recipe_id).first()
    if not recipe:
        return abort(404)

    current_app.logger.info(f"Recipe data [ID {recipe_id}] updated. Old data = {recipe.to_dict()}")

    try:
        json_data = json.loads(request.form.get("recipe"))
        cover_image = request.files.get("image")
    except:
        return abort(400)

    cover_name = recipe.image
    if cover_image:
        cover_name = save_picture(cover_image)
        if not cover_name:
            return abort(400, "The uploaded image was not valid. Please choose another one.")

    ingredients = []
    for ingredient, proportion in zip(json_data["ingredients"], json_data["proportions"]):
        ingredients.append({"ingredient": ingredient["value"], "proportion": proportion["value"]})

    steps = []
    for step in json_data["steps"]:
        steps.append({"description": step["value"]})

    labels = Label.query.filter(Label.name.in_([label["value"] for label in json_data["labels"]])).all()

    # Update <recipe> fields
    recipe.image = cover_name
    recipe.title = json_data["title"]
    recipe.cooking_time = json_data["cooking"]
    recipe.prep_time = json_data["preparation"]
    recipe.servings = json_data["servings"]
    recipe.comment = json_data.get("comment")
    recipe.ingredients = json.dumps(ingredients)
    recipe.steps = json.dumps(steps)

    # Update <labels> relationship
    recipe.labels.clear()
    for label in labels:
        recipe.labels.append(label)

    db.session.commit()

    return {}, 204


@main_bp.route("/all_recipes", methods=["GET"])
@token_auth.login_required
def all_recipes():
    data = dict(
        recipes=[recipe.to_dict() for recipe in Recipe.query.all()],
        labels=[label.to_dict() for label in Label.query.order_by(Label.order.asc()).all()],
    )

    return jsonify(data=data), 200


@main_bp.route("/delete_recipe", methods=["POST"])
@token_auth.login_required
def delete_recipe():
    try:
        recipe_id = request.get_json()["recipe_id"]
    except:
        return abort(400)

    recipe = Recipe.query.filter_by(id=recipe_id).first()
    if not recipe:
        return abort(404, "Recipe not found in the database.")

    db.session.delete(recipe)
    db.session.commit()

    return {}, 204


@main_bp.route("/get_labels", methods=["GET"])
@token_auth.login_required
def get_labels():
    labels = [label.to_dict() for label in Label.query.order_by(Label.order.asc()).all()]
    return jsonify(data=labels), 200


@main_bp.route("/export_recipe")
@token_auth.login_required
def export_recipe():
    """ Export recipe as PDF (not implemented for now) """
    pass
