import logging
import os
from typing import Type
from logging.handlers import SMTPHandler, RotatingFileHandler

from flask import Flask
from flask_cors import CORS
from flask_mail import Mail
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

from backend.config import Config


config = Config()
mail = Mail()
db = SQLAlchemy()
migrate = Migrate()
cors = CORS()


def _import_blueprints(app: Flask):
    from backend.api.routes.tokens import tokens as tokens_bp
    from backend.api.core.errors import errors as errors_bp
    from backend.api.routes.main import main_bp as main_bp

    api_blueprints = [main_bp, errors_bp, tokens_bp]
    for blueprint in api_blueprints:
        app.register_blueprint(blueprint, url_prefix="/api")


def _create_app_logger(app: Flask):
    """ Create an app logger registering the INFO, WARNING, and ERRORS, for the app """

    log_file_path = f"{os.path.abspath(os.path.dirname(__file__))}/static/log/recipes.log"
    if not os.path.exists(log_file_path):
        os.makedirs(os.path.dirname(log_file_path), exist_ok=True)
        with open(log_file_path, "a"):
            pass

    handler = RotatingFileHandler(log_file_path, maxBytes=30000, backupCount=5)
    handler.setFormatter(logging.Formatter("%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]"))
    handler.setLevel(logging.INFO)

    app.logger.addHandler(handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info("Famiglia Recipes is starting up...")


def _create_mail_handler(app: Flask):
    """ Create a mail handler (TSL only) associated with the app logger: send an email when an error occurs """

    mail_handler = SMTPHandler(
        mailhost=(app.config["MAIL_SERVER"], app.config["MAIL_PORT"]),
        fromaddr=app.config["MAIL_USERNAME"],
        toaddrs=app.config["MAIL_USERNAME"],
        subject="Famiglia Recipes - Exceptions occurred",
        credentials=(app.config["MAIL_USERNAME"], app.config["MAIL_PASSWORD"]),
        secure=(),
    )

    mail_handler.setLevel(logging.ERROR)
    app.logger.addHandler(mail_handler)


def create_app(config_class: Type[Config] = Config) -> Flask:
    app = Flask(__name__, static_url_path="/api/static")
    app.config.from_object(config_class)
    app.url_map.strict_slashes = False

    mail.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, supports_credentials=True, origins=["http://localhost:3000", "http://127.0.0.1:3000"])

    with app.app_context():
        _import_blueprints(app)
        db.create_all()

        if not app.debug and not app.testing:
            _create_app_logger(app)
            _create_mail_handler(app)

        from backend.api.models.models import Label
        Label.init_labels()

        return app
