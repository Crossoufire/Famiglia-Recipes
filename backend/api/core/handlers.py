from __future__ import annotations

from http import HTTPStatus
from typing import Tuple, Dict

from flask import abort
from werkzeug.local import LocalProxy
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from werkzeug.exceptions import Forbidden, Unauthorized

from backend.api.models.models import User


basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth()

# Local proxy to make <current_user> available everywhere
current_user = LocalProxy(lambda: token_auth.current_user())


@basic_auth.verify_password
def verify_password(username: str, password: str) -> User:
    user = User.query.filter_by(username=username).first()

    if not user or not user.verify_password(password):
        return abort(401, description="Invalid username or password")

    return user


@basic_auth.error_handler
def basic_auth_error(status: int = HTTPStatus.UNAUTHORIZED) -> Tuple[Dict, int, Dict]:
    error = (Forbidden if status == HTTPStatus.FORBIDDEN else Unauthorized)()

    response = dict(
        code=error.code,
        message=error.name,
        description=error.description,
    )

    return response, error.code, {"WWW-Authenticate": "Form"}


@token_auth.verify_token
def verify_token(access_token: str) -> str | None:
    return User.verify_access_token(access_token) if access_token else None


@token_auth.error_handler
def token_auth_error(status: int = HTTPStatus.UNAUTHORIZED) -> Tuple[Dict, int]:
    error = (Forbidden if status == HTTPStatus.FORBIDDEN else Unauthorized)()

    response = dict(
        code=error.code,
        message=error.name,
        description=error.description,
    )

    return response, error.code
