import imghdr
import os
import secrets
from typing import Type, Any, Union
from flask import current_app


def get_subclasses(cls: Type) -> Union[Type, Any]:
    """ Get all the subclasses of a class (used now for ApiData) """

    subclasses = set()
    for subclass in cls.__subclasses__():
        subclasses.add(subclass)
        subclasses.update(get_subclasses(subclass))

    return subclasses


def save_picture(form_picture) -> str:
    """ Save the recipe image locally """

    picture_fn = None
    if imghdr.what(form_picture) in ("gif", "jpeg", "jpg", "png", "webp", "tiff"):
        file = form_picture
        random_hex = secrets.token_hex(8)
        _, f_ext = os.path.splitext(form_picture.filename)
        picture_fn = random_hex + f_ext
        file.save(os.path.join(current_app.root_path, "static/recipe_images", picture_fn))

    return picture_fn
