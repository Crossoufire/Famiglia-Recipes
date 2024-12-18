import imghdr
import os
import secrets
import time
from enum import Enum
from functools import wraps
from typing import Callable
from datetime import datetime, timezone

from flask import current_app


def save_picture(form_picture) -> str:
    picture_fn = None
    if imghdr.what(form_picture) in ("gif", "jpeg", "jpg", "png", "webp", "tiff"):
        file = form_picture
        random_hex = secrets.token_hex(8)
        _, f_ext = os.path.splitext(form_picture.filename)
        picture_fn = random_hex + f_ext
        file.save(os.path.join(current_app.root_path, "static/recipe_images", picture_fn))

    return picture_fn


def timer(func: Callable):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"Elapsed time: {int((end_time - start_time) * 1000)} ms")
        return result

    return wrapper


def aware_utcnow():
    return datetime.now(timezone.utc)


def naive_utcnow():
    return aware_utcnow().replace(tzinfo=None)


class RoleType(Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    USER = "user"
