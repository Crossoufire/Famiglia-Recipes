from __future__ import annotations
from datetime import datetime
from typing import Tuple, Dict
from flask import Blueprint, request, abort, url_for, current_app
from werkzeug.http import dump_cookie
from werkzeug.security import generate_password_hash
from backend.api import db
from backend.api.models import Token, User
from backend.api.routes.handlers import basic_auth, current_user, token_auth
from backend.api.routes.email import send_email


tokens = Blueprint("tokens", __name__)


def token_response(token: Token) -> Tuple[Dict, int, Dict]:
    headers = {
        "Set-Cookie": dump_cookie(
            key="refresh_token",
            value=token.refresh_token,
            path=url_for("tokens.new_token"),
            secure=True,
            httponly=True,
            samesite="none",
            max_age=current_app.config["REFRESH_TOKEN_DAYS"] * 24 * 60 * 60,
        ),
    }

    return {"access_token": token.access_token}, 200, headers


@tokens.route("/register_user", methods=["POST"])
def register_user():
    try:
        data = request.get_json()
    except:
        return abort(400)

    # Necessary register fields
    fields = ("username", "email", "password", "registerKey")

    if not all(f in data for f in fields):
        return abort(400, f"Not all fields included: {', '.join(fields)}")

    if data["registerKey"] != current_app.config["REGISTER_KEY"]:
        return abort(401, {"registerKey": "Invalid register key"})

    if User.query.filter_by(username=data["username"]).first():
        return abort(401, {"username": "Invalid Username"})

    if User.query.filter_by(email=data["email"]).first():
        return abort(401, {"email": "Invalid email"})

    # noinspection PyArgumentList
    new_user = User(
        username=data["username"],
        email=data["email"],
        password=generate_password_hash(data["password"]),
        registered=datetime.utcnow(),
        last_seen=datetime.utcnow(),
    )

    db.session.add(new_user)
    db.session.commit()

    return {"message": "Your account has been successfully created"}, 200


@tokens.route("/current_user", methods=["GET"])
@token_auth.login_required
def get_current_user() -> Dict:
    return current_user.to_dict()


@tokens.route("/tokens", methods=["POST"])
@basic_auth.login_required
def new_token():
    """ Create an <access token> and a <refresh token>. The <refresh token> is returned as a hardened cookie """

    token = current_user.generate_auth_token()
    db.session.add(token)
    Token.clean()
    db.session.commit()

    return token_response(token)


@tokens.route("/tokens", methods=["PUT"])
def refresh():
    """ Refresh an <access token>. The client needs to pass the <refresh token> in a `refresh_token` cookie.
    The <access token> must be passed in the request body """

    access_token = request.get_json().get("access_token")
    refresh_token = request.cookies.get("refresh_token")

    if not access_token or not refresh_token:
        return abort(401)

    token = User.verify_refresh_token(refresh_token, access_token)
    if token is None:
        return abort(401)

    token.expire()
    new_token_ = token.user.generate_auth_token()

    db.session.add_all([token, new_token_])
    db.session.commit()

    return token_response(new_token_)


@tokens.route("/tokens", methods=["DELETE"])
def revoke_token():
    """ Revoke an access token (used for logout) """

    access_token = request.headers["Authorization"].split()[1]
    token = Token.query.filter_by(access_token=access_token).first()
    if not token:
        return abort(401)

    token.expire()
    db.session.commit()

    return {}, 204


@tokens.route("/tokens/reset_password_token", methods=["POST"])
def reset_password_token():
    try:
        data = request.get_json()
    except:
        return abort(400)

    # Necessary fields
    fields = ("email", "callback")
    if not all(f in data for f in fields):
        return abort(400, f"Not all fields included: {', '.join(fields)}")

    user = User.query.filter_by(email=data["email"]).first()
    if not user:
        return abort(401, "This email is invalid")

    try:
        send_email(
            to=user.email,
            username=user.username,
            subject="Password Reset Request",
            template="password_reset",
            callback=data["callback"],
            token=user.generate_jwt_token(),
        )
    except Exception as e:
        current_app.logger.error(f"ERROR sending an email to account [{user.id}]: {e}")
        return abort(400, "An error occurred while sending the password reset email. Please try again later.")

    return {}, 204


@tokens.route("/tokens/reset_password", methods=["POST"])
def reset_password():
    try:
        data = request.get_json()
    except:
        return abort(400)

    user = User.verify_jwt_token(data["token"])
    if not user:
        return abort(400, "This is an invalid or an expired token.")

    user.password = generate_password_hash(data.get("new_password"))
    db.session.commit()
    current_app.logger.info(f"[INFO] - [{user.id}] Password changed.")

    return {}, 204
