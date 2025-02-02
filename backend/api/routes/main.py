import json

from flask import request, abort, jsonify, Blueprint

from backend.api import db
from backend.api.models.models import Recipe, Label, Comment
from backend.api.core.handlers import token_auth, current_user
from backend.api.utils.helper import save_picture, naive_utcnow


main_bp = Blueprint("main", __name__)


@main_bp.route("/dashboard", methods=["GET"])
@token_auth.login_required
def dashboard():
    data = dict(
        last_recipes=Recipe.get_most_recent(limit=8),
        favorite_recipes=current_user.favorite_recipes,
    )
    return jsonify(data=data), 200


@main_bp.route("/details/<recipe_id>", methods=["GET"])
@token_auth.login_required
def details(recipe_id: int):
    recipe = Recipe.query.get_or_404(recipe_id)
    return jsonify(data=recipe.to_dict()), 200


@main_bp.route("/add_recipe", methods=["POST"])
@token_auth.login_required
def add_recipe():
    try:
        json_data = json.loads(request.form["recipe"])
        cover_image, cover_name = request.files.get("image"), None
    except:
        return abort(400, description="Invalid Request")

    if cover_image:
        cover_name = save_picture(cover_image)
        if not cover_name:
            return abort(400, description="The uploaded image is not processable. Please select another one.")

    steps = [dict(description=step) for step in json_data["steps"]]
    labels = Label.query.filter(Label.name.in_(json_data["labels"])).all()
    ingredients = [dict(proportion=ing["quantity"], ingredient=ing["description"]) for ing in json_data["ingredients"]]

    new_recipe = Recipe(
        image=cover_name,
        title=json_data["title"],
        cooking_time=json_data["cooking"],
        prep_time=json_data["preparation"],
        servings=json_data["servings"],
        comment=json_data.get("comment"),
        ingredients=json.dumps(ingredients),
        steps=json.dumps(steps),
        labels=labels,
        submitter=current_user,
        submitter_id=current_user.id,
        submitted_date=naive_utcnow(),
    )

    db.session.add(new_recipe)
    db.session.commit()

    # Add comment to recipe
    new_comment = Comment(
        user_id=current_user.id,
        recipe_id=new_recipe.id,
        content=json_data.get("comment"),
        created_at=naive_utcnow(),
    )

    db.session.add(new_comment)
    db.session.commit()

    return jsonify(data=dict(recipe_id=new_recipe.id)), 200


@main_bp.route("/update_favorite", methods=["POST"])
@token_auth.login_required
def update_favorite():
    try:
        recipe_id = request.get_json()["recipe_id"]
    except:
        return abort(400, description="Invalid request")

    recipe = Recipe.query.get_or_404(recipe_id)
    current_user.update_favorite_recipes(recipe)
    db.session.commit()

    return {}, 204


@main_bp.route("/edit_recipe/<recipe_id>", methods=["GET"])
@token_auth.login_required
def get_recipe_for_edit(recipe_id: int):
    recipe = Recipe.query.get_or_404(recipe_id)
    data = dict(
        fields={key: value for key, value in recipe.to_dict().items() if key in recipe.form_only()},
        labels=Label.all_labels_as_list(),
    )
    return jsonify(data=data), 200


@main_bp.route("/edit_recipe/<recipe_id>", methods=["POST"])
@token_auth.login_required
def edit_recipe(recipe_id: int):
    recipe = Recipe.query.get_or_404(recipe_id)

    try:
        json_data = json.loads(request.form.get("recipe"))
        cover_image = request.files.get("image")
    except:
        return abort(400, description="Invalid request")

    cover_name = recipe.image
    if cover_image:
        cover_name = save_picture(cover_image)
        if not cover_name:
            return abort(400, description="The uploaded image is not processable. Please choose another one.")

    steps = [dict(description=step) for step in json_data["steps"]]
    labels = Label.query.filter(Label.name.in_(json_data["labels"])).all()
    ingredients = [dict(proportion=ing["quantity"], ingredient=ing["description"]) for ing in json_data["ingredients"]]

    # Update <recipe> fields
    recipe.image = cover_name
    recipe.title = json_data["title"]
    recipe.cooking_time = json_data["cooking"]
    recipe.prep_time = json_data["preparation"]
    recipe.servings = json_data["servings"]
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
        labels=Label.all_labels_as_list(),
        recipes=[recipe.to_dict() for recipe in Recipe.query.all()],
    )
    return jsonify(data=data), 200


@main_bp.route("/delete_recipe", methods=["POST"])
@token_auth.login_required
def delete_recipe():
    try:
        recipe_id = request.get_json()["recipe_id"]
    except:
        return abort(400, description="Invalid request")

    recipe = Recipe.query.get_or_404(recipe_id)

    # Delete comments
    Comment.query.filter_by(recipe_id=recipe_id).delete()
    
    db.session.delete(recipe)
    db.session.commit()

    return {}, 204


@main_bp.route("/get_labels", methods=["GET"])
@token_auth.login_required
def get_labels():
    return jsonify(data=Label.all_labels_as_list()), 200


@main_bp.route("/recipe/<int:recipe_id>/comments", methods=["GET"])
@token_auth.login_required
def get_recipe_comments(recipe_id: int):
    """ Get all comments for a specific recipe """
    comments = Comment.query.filter_by(recipe_id=recipe_id).order_by(Comment.created_at.desc()).all()
    return jsonify(data=[comment.to_dict() for comment in comments]), 200


@main_bp.route("/recipe/<int:recipe_id>/comments", methods=["POST"])
@token_auth.login_required
def add_comment(recipe_id: int):
    """ Add a new comment to a recipe """

    try:
        data = request.get_json()
        content = data["content"]
    except:
        return abort(400, description="Invalid request")

    if not content.strip():
        return abort(400, description="Comment cannot be empty")

    comment = Comment(
        user_id=current_user.id,
        recipe_id=recipe_id,
        content=content,
        created_at=naive_utcnow(),
    )

    db.session.add(comment)
    db.session.commit()

    return jsonify(data=comment.to_dict()), 200


@main_bp.route("/comments/<int:comment_id>", methods=["POST"])
@token_auth.login_required
def update_comment(comment_id: int):
    """ Update an existing comment """

    comment = Comment.query.get_or_404(comment_id)

    # Check if current user is comment author
    if current_user.id != comment.user_id:
        return abort(403, description="You can only edit your own comments")

    try:
        data = request.get_json()
        content = data["content"]
    except:
        return abort(400, description="Invalid request")

    if not content.strip():
        return abort(400, description="Comment cannot be empty")

    comment.content = content
    comment.updated_at = naive_utcnow()

    db.session.commit()

    return jsonify(data=comment.to_dict()), 200


@main_bp.route("/comments/<int:comment_id>", methods=["DELETE"])
@token_auth.login_required
def delete_comment(comment_id: int):
    """ Delete a comment """

    comment = Comment.query.get_or_404(comment_id)
    if current_user.id != comment.user_id:
        return abort(403, description="You don't have permission to delete this comment")

    db.session.delete(comment)
    db.session.commit()

    return {}, 204
