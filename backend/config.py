import os

from dotenv import load_dotenv


load_dotenv()
basedir = os.path.abspath(os.path.dirname(__file__))


def as_bool(value: str) -> bool:
    if value:
        return value.lower() in ["true", "yes", "on", "1"]
    return False


class Config:
    # Database option
    SQLALCHEMY_DATABASE_URI = (os.environ.get("FAM_DATABASE_URI") or
                               f"sqlite:///{os.path.join(basedir + '/instance', 'site.db')}")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Security options
    SECRET_KEY = os.environ.get("SECRET_KEY") or "you-will-never-guess"
    ACCESS_TOKEN_MINUTES = int(os.environ.get("ACCESS_TOKEN_MINUTES") or "15")
    REFRESH_TOKEN_DAYS = int(os.environ.get("REFRESH_TOKEN_DAYS") or "7")
    RESET_TOKEN_MINUTES = int(os.environ.get("RESET_TOKEN_MINUTES") or "15")
    MAX_CONTENT_LENGTH = 8 * 1024 * 1024

    # Email options
    MAIL_SERVER = os.environ.get("MAIL_SERVER", "localhost")
    MAIL_PORT = int(os.environ.get("MAIL_PORT") or "25")
    MAIL_USE_TLS = as_bool(os.environ.get("MAIL_USE_TLS"))
    MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")

    # Register key for private website
    REGISTER_KEY = os.environ.get("REGISTER_KEY")
