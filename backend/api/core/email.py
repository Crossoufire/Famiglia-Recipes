from pathlib import Path
from threading import Thread

from flask_mail import Message
from flask import current_app, Flask

from backend.api import mail


def _send_async_email(app: Flask, to: str, username: str, subject: str, template: str, callback: str, token: str):
    with app.app_context():
        path = Path(current_app.root_path, f"templates/{template}.html")
        with open(path) as fp:
            email_template = fp.read().replace("{1}", username)
            email_template = email_template.replace("{2}", f"<a href='{callback}/?token={token}'>click here</a>")

        msg = Message(
            subject=f"Famiglia-Recipes - {subject}",
            sender=current_app.config["MAIL_USERNAME"],
            recipients=[to],
            html=email_template,
            bcc=[current_app.config["MAIL_USERNAME"]],
            reply_to=current_app.config["MAIL_USERNAME"],
        )
        mail.send(msg)


def send_email(to: str, username: str, subject: str, template: str, callback: str, token: str):
    # noinspection PyProtectedMember,PyUnresolvedReferences
    app = current_app._get_current_object()
    thread = Thread(target=_send_async_email, args=(app, to, username, subject, template, callback, token))
    thread.start()

    return thread
