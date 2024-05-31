from __future__ import annotations
import json
import secrets
from datetime import datetime, timedelta
from time import time
from typing import Dict, List
import jwt
from flask import current_app, url_for
from werkzeug.security import check_password_hash, generate_password_hash
from backend.api import db
from backend.api.utils.helper import RoleType


class Token(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), index=True)
    access_token = db.Column(db.String(64), nullable=False, index=True)
    access_expiration = db.Column(db.DateTime, nullable=False)
    refresh_token = db.Column(db.String(64), nullable=False, index=True)
    refresh_expiration = db.Column(db.DateTime, nullable=False)

    # --- Relationships ------------------------------------------------------------
    user = db.relationship("User", backref=db.backref("token", lazy="noload"))

    def generate(self):
        self.access_token = secrets.token_urlsafe()
        self.access_expiration = datetime.utcnow() + timedelta(minutes=current_app.config["ACCESS_TOKEN_MINUTES"])
        self.refresh_token = secrets.token_urlsafe()
        self.refresh_expiration = datetime.utcnow() + timedelta(days=current_app.config["REFRESH_TOKEN_DAYS"])

    def expire(self, delay: int = None):
        # Add 5 second delay for simultaneous requests
        if delay is None:
            delay = 5 if not current_app.testing else 0

        self.access_expiration = datetime.utcnow() + timedelta(seconds=delay)
        self.refresh_expiration = datetime.utcnow() + timedelta(seconds=delay)

    @classmethod
    def clean(cls):
        """ Remove all tokens that have been expired for more than a day to keep the database clean """

        yesterday = datetime.utcnow() - timedelta(days=1)
        cls.query.filter(cls.refresh_expiration < yesterday).delete()
        db.session.commit()


class User(db.Model):
    def __repr__(self):
        return f"<User [{self.id}] - {self.username}>"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(60), unique=True, nullable=False)
    email = db.Column(db.String(60), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum(RoleType), nullable=False, default=RoleType.USER)
    registered = db.Column(db.DateTime, nullable=False)
    last_seen = db.Column(db.DateTime)

    # --- Relationships --------------------------------------------------
    fav_recipes = db.relationship("Recipe", secondary="favorites", back_populates="favorited_by")
    added_recipes = db.relationship("Recipe", back_populates="submitter")

    def verify_password(self, password: str):
        return check_password_hash(self.password, password)

    def set_password(self, password: str):
        self.password = generate_password_hash(password)

    def ping(self):
        self.last_seen = datetime.utcnow()

    def revoke_all_tokens(self):
        Token.query.filter(Token.user == self).delete()
        db.session.commit()

    def generate_auth_token(self) -> Token:
        token = Token(user=self)
        token.generate()

        return token

    def to_dict(self) -> Dict:
        excluded_attrs = ("email", "password")
        user_dict = {c.name: getattr(self, c.name) for c in self.__table__.columns if c.name not in excluded_attrs}

        user_dict.update({
            "registered": self.registered.strftime("%d %b %Y"),
            "last_seen": self.last_seen.strftime("%d %b %Y"),
            "role": RoleType(self.role).value,
        })

        return user_dict

    def update_fav(self, recipe: Recipe):
        if recipe not in self.fav_recipes:
            self.fav_recipes.append(recipe)
        else:
            self.fav_recipes.remove(recipe)
        db.session.commit()

    def generate_jwt_token(self, expires_in: int = 600) -> str:
        """ Generate the user <jwt token> for forgotten password """

        token = jwt.encode(
            payload={"token": self.id, "exp": time() + expires_in},
            key=current_app.config["SECRET_KEY"],
            algorithm="HS256",
        )
        return token

    @staticmethod
    def verify_access_token(access_token: str) -> User:
        token = Token.query.filter(Token.access_token == access_token).first()
        if token:
            if token.access_expiration > datetime.utcnow():
                token.user.ping()
                db.session.commit()
                return token.user

    @staticmethod
    def verify_refresh_token(refresh_token: str, access_token: str) -> Token:
        token = Token.query.filter_by(refresh_token=refresh_token, access_token=access_token).first()
        if token:
            if token.refresh_expiration > datetime.utcnow():
                return token

            # Try to refresh with expired token: revoke all tokens from user as precaution
            token.user.revoke_all_tokens()
            db.session.commit()

    @staticmethod
    def verify_jwt_token(token: str) -> User | None:
        """ Verify the user <jwt token> for forgotten password """

        try:
            user_id = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])["token"]
        except:
            return None

        return User.query.filter_by(id=user_id).first()


class Recipe(db.Model):
    def __repr__(self):
        return f"<Recipe [{self.id}] - {self.title[:10]}>"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    image = db.Column(db.String, default="default.png")
    cooking_time = db.Column(db.Integer, nullable=False)
    prep_time = db.Column(db.Integer, nullable=False)
    servings = db.Column(db.Integer, nullable=False)
    ingredients = db.Column(db.Text, nullable=False)
    steps = db.Column(db.Text, nullable=False)
    comment = db.Column(db.Text)
    submitter_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    submitted_date = db.Column(db.DateTime, nullable=False)

    # --- Relationships --------------------------------------------------
    submitter = db.relationship("User", back_populates="added_recipes")
    favorited_by = db.relationship("User", secondary="favorites", back_populates="fav_recipes")
    labels = db.relationship("Label", secondary="recipe_label", back_populates="recipes")

    @property
    def cover_image(self) -> str:
        return url_for("static", filename=f"recipe_images/{self.image}")

    def to_dict(self) -> Dict:
        from backend.api.routes.handlers import current_user

        recipe_dict = {c.name: getattr(self, c.name) for c in self.__table__.columns}

        recipe_dict.update({
            "ingredients": json.loads(self.ingredients),
            "cover_image": self.cover_image,
            "steps": json.loads(self.steps),
            "submitted_date": self.submitted_date.strftime("%d %b %Y"),
            "submitter": self.submitter.to_dict(),
            "labels": [label.to_dict() for label in self.labels],
            "is_favorited": current_user in self.favorited_by,
        })

        return recipe_dict

    @staticmethod
    def form_only() -> List[str]:
        return ["title", "image", "cooking_time", "prep_time", "servings", "ingredients", "steps", "comment", "labels"]


class Label(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    color = db.Column(db.String, nullable=False)

    # --- Relationships --------------------------------------------------
    recipes = db.relationship("Recipe", secondary="recipe_label", back_populates="labels")

    def to_dict(self) -> Dict:
        return {"id": self.id, "name": self.name, "color": self.color}

    @classmethod
    def init_labels(cls):
        import os

        with open(os.path.join(current_app.root_path, "static/labels.json")) as fp:
            json_labels = json.load(fp)

        for label in json_labels:
            label_row = cls.query.filter_by(name=label["name"]).first()
            if not label_row:
                db.session.add(cls(name=label["name"], color=label["color"]))
            else:
                label_row.color = label["color"]

        db.session.commit()


favorites = db.Table(
    "favorites",
    db.Column("user_id", db.Integer, db.ForeignKey("user.id"), primary_key=True),
    db.Column("recipe_id", db.Integer, db.ForeignKey("recipe.id"), primary_key=True),
)


recipe_label = db.Table(
    "recipe_label",
    db.Column("recipe_id", db.Integer, db.ForeignKey("recipe.id"), primary_key=True),
    db.Column("label_id", db.Integer, db.ForeignKey("label.id"), primary_key=True),
)
