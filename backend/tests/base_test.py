import unittest
from datetime import datetime
from typing import Type, Dict

from werkzeug.security import generate_password_hash

from backend.api import db, create_app
from backend.config import Config


class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite://"
    REGISTER_KEY = "oui"


class BaseTest(unittest.TestCase):
    config: Type[Config] = TestConfig

    def connexion(self, username: str = "test", password: str = "toto") -> Dict:
        rv = self.client.post("/api/tokens", auth=(username, password))
        self.access_token = rv.json["access_token"]

        return {"Authorization": f"Bearer {self.access_token}"}

    def register_new_user(self, username: str):
        rv = self.client.post("/api/register_user", json={
            "password": "pipou",
            "username": username,
            "email": f"{username}@example.com",
            "registerKey": "oui",
        })
        assert rv.status_code == 204

    def setUp(self):
        self.app = create_app(self.config)
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

        from backend.api.models.models import User
        from backend.api.models.models import Label

        user = User(
            username="test",
            email="test@example.com",
            registered=datetime.utcnow(),
            password=generate_password_hash("toto"),
        )

        db.session.add(user)
        db.session.commit()

        Label.init_labels()

        self.client = self.app.test_client()

    def tearDown(self):
        db.session.close()
        db.drop_all()
        self.app_context.pop()
