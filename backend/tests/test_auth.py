from datetime import datetime, timedelta
from unittest import mock
from backend.tests.base_test import BaseTest


class AuthTests(BaseTest):
    def test_no_auth(self):
        rv = self.client.get("/api/current_user")
        assert rv.status_code == 401

    def test_no_login(self):
        rv = self.client.post("/api/tokens")
        assert rv.status_code == 401

    def test_bad_login(self):
        rv = self.client.post("/api/tokens", auth=("test", "tutu"))
        assert rv.status_code == 401

    def test_get_token(self):
        rv = self.client.post("/api/tokens", auth=("test", "toto"))
        assert rv.status_code == 200

        access_token = rv.json["access_token"]
        refresh_token = rv.headers["Set-Cookie"].split(";")[0].split("=")[1]

        rv = self.client.get("/api/current_user", headers={"Authorization": f"Bearer {access_token}"})
        assert rv.status_code == 200
        assert rv.json["username"] == "test"

        rv = self.client.get("/api/current_user", headers={"Authorization": f'Bearer {access_token + "x"}'})
        assert rv.status_code == 401

        rv = self.client.get("/api/current_user", headers={"Authorization": f"Bearer {refresh_token}"})
        assert rv.status_code == 401

    def test_token_expired(self):
        rv = self.client.post("/api/tokens", auth=("test", "toto"))
        assert rv.status_code == 200

        access_token = rv.json["access_token"]

        with mock.patch("backend.api.models.datetime") as dt:
            dt.utcnow.return_value = datetime.utcnow() + timedelta(days=1)
            rv = self.client.get("/api/current_user", headers={"Authorization": f"Bearer {access_token}"})
            assert rv.status_code == 401

    def test_refresh_token(self):
        rv = self.client.post("/api/tokens", auth=("test", "toto"))
        assert rv.status_code == 200

        access_token1 = rv.json["access_token"]
        refresh_token1 = rv.headers["Set-Cookie"].split(";")[0].split("=")[1]

        self.client.set_cookie("refresh_token", refresh_token1)
        rv = self.client.put("/api/tokens", json={"access_token": access_token1})
        assert rv.status_code == 200

        assert rv.json["access_token"] != access_token1
        assert rv.headers["Set-Cookie"].split(";")[0].split("=")[1] != refresh_token1

        access_token2 = rv.json["access_token"]

        rv = self.client.get("/api/current_user", headers={"Authorization": f"Bearer {access_token2}"})
        assert rv.status_code == 200
        assert rv.json["username"] == "test"

        rv = self.client.get("/api/current_user", headers={"Authorization": f"Bearer {access_token1}"})
        assert rv.status_code == 401

    def test_refresh_token_failure(self):
        rv = self.client.post("/api/tokens", auth=("test", "toto"))
        assert rv.status_code == 200

        access_token = rv.json["access_token"]

        self.client.delete_cookie("refresh_token", path="/api/tokens")
        rv = self.client.put("/api/tokens", json={"access_token": access_token})
        assert rv.status_code == 401

    def test_revoke(self):
        rv = self.client.post("/api/tokens", auth=("test", "toto"))
        assert rv.status_code == 200

        access_token = rv.json["access_token"]
        header = {"Authorization": f"Bearer {access_token}"}

        rv = self.client.get("/api/current_user", headers=header)
        assert rv.status_code == 200

        rv = self.client.delete("/api/tokens", headers=header)
        assert rv.status_code == 204

        rv = self.client.get("/api/current_user", headers=header)
        assert rv.status_code == 401

    def test_refresh_revoke_all(self):
        rv = self.client.post("/api/tokens", auth=("test", "toto"))
        assert rv.status_code == 200

        access_token1 = rv.json["access_token"]
        refresh_token1 = rv.headers["Set-Cookie"].split(";")[0].split("=")[1]

        rv = self.client.get("/api/current_user", headers={"Authorization": f"Bearer {access_token1}"})
        assert rv.status_code == 200

        rv = self.client.post("/api/tokens", auth=("test", "toto"))
        assert rv.status_code == 200

        access_token2 = rv.json["access_token"]
        refresh_token2 = rv.headers["Set-Cookie"].split(";")[0].split("=")[1]

        self.client.set_cookie("refresh_token", refresh_token2, path="/api/tokens")
        rv = self.client.put("/api/tokens", json={"access_token": access_token2})
        assert rv.status_code == 200

        access_token3 = rv.json["access_token"]
        refresh_token3 = rv.headers["Set-Cookie"].split(";")[0].split("=")[1]

        self.client.set_cookie("refresh_token", refresh_token2, path="/api/tokens")
        rv = self.client.put("/api/tokens", json={"access_token": access_token2})
        assert rv.status_code == 401

        rv = self.client.get("/api/current_user", headers={"Authorization": f"Bearer {access_token1}"})
        assert rv.status_code == 401

        rv = self.client.get('/api/current_user', headers={'Authorization': f"Bearer {access_token2}"})
        assert rv.status_code == 401

        rv = self.client.get("/api/current_user", headers={"Authorization": f"Bearer {access_token3}"})
        assert rv.status_code == 401

        self.client.set_cookie("refresh_token", refresh_token1, path="/api/tokens")
        rv = self.client.put("/api/tokens", json={"access_token": access_token1})
        assert rv.status_code == 401

        self.client.set_cookie("refresh_token", refresh_token2, path="/api/tokens")
        rv = self.client.put("/api/tokens", json={"access_token": access_token2})
        assert rv.status_code == 401

        self.client.set_cookie("refresh_token", refresh_token3, path="/api/tokens")
        rv = self.client.put("/api/tokens", json={"access_token": access_token3})
        assert rv.status_code == 401

    def test_reset_password(self):
        with mock.patch("backend.api.routes.tokens.send_email") as send_email:
            rv = self.client.post("/api/tokens/reset_password_token", json={
                "email": "bad@example.com",
                "callback": "http://localhost:3000/reset_password",
            })
            assert rv.status_code == 401

            rv = self.client.post("/api/tokens/reset_password_token", json={
                "email": "test@example.com",
                "callback": "http://localhost:3000/reset_password",
            })
            assert rv.status_code == 204

        send_email.assert_called_once()
        assert send_email.call_args[1]["to"] == "test@example.com"
        assert send_email.call_args[1]["username"] == "test"
        assert send_email.call_args[1]["subject"] == "Password Reset Request"
        assert send_email.call_args[1]["template"] == "password_reset"
        assert send_email.call_args[1]["callback"] == "http://localhost:3000/reset_password"

        token = send_email.call_args[1]["token"]

        rv = self.client.post("/api/tokens/reset_password", json={"token": token + "x", "new_password": "tutu"})
        assert rv.status_code == 400

        rv = self.client.post("/api/tokens/reset_password", json={"token": token, "new_password": "tutu"})
        assert rv.status_code == 204

        rv = self.client.post("/api/tokens", auth=("test", "toto"))
        assert rv.status_code == 401

        rv = self.client.post("/api/tokens", auth=("test", "tutu"))
        assert rv.status_code == 200
