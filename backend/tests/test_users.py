from backend.tests.base_test import BaseTest


class UserTests(BaseTest):
    def test_register_user(self):
        rv = self.client.post("/api/register_user", json={
            "username": "user",
            "email": "user@example.com",
            "password": "pipou",
            "registerKey": "oui",
        })
        assert rv.status_code == 200

        rv = self.client.post("/api/register_user", json={
            "username": "user",
            "email": "user2@example.com",
            "password": "pipou",
            "registerKey": "oui",
        })
        assert rv.status_code == 401

        rv = self.client.post("/api/register_user", json={
            "username": "user2",
            "email": "user@example.com",
            "password": "pipou",
            "registerKey": "oui",
        })
        assert rv.status_code == 401

        rv = self.client.post("/api/register_user", json={
            "username": "titi",
            "email": "titi@example.com",
            "password": "pipou",
            "registerKey": "non",
        })
        assert rv.status_code == 401

    def test_get_current_user(self):
        headers = self.connexion()
        rv = self.client.get("/api/current_user", headers=headers)
        assert rv.json["username"] == "test"
        assert "password" not in rv.json and "email" not in rv.json
