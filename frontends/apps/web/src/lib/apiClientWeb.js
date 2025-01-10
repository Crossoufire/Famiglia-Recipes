import {ApiClient} from "@famiglia-recipes/api/src";


export class ApiClientWeb extends ApiClient {
    setAccessToken(token) {
        localStorage.setItem("accessToken", token);
        return Promise.resolve();
    }

    getAccessToken() {
        const token = localStorage.getItem("accessToken");
        return Promise.resolve(token);
    }

    removeAccessToken() {
        localStorage.removeItem("accessToken");
        return Promise.resolve();
    }
}
