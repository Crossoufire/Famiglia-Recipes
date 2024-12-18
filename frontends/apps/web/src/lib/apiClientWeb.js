import {ApiClient} from "@famiglia-recipes/api/src";


export class ApiClientWeb extends ApiClient {
    setAccessToken(token) {
        localStorage.setItem("accessToken", token);
    }

    getAccessToken() {
        return localStorage.getItem("accessToken");
    }

    removeAccessToken() {
        localStorage.removeItem("accessToken");
    }
}
