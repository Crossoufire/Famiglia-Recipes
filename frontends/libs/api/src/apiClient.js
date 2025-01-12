import {APIError} from "./apiError";


let api = null;


export class ApiClient {
    constructor(base_api_url = "") {
        this.base_url = `${base_api_url}/api`;
    }

    isAuthenticated() {
        return this.getAccessToken().then(token => !!token);
    }

    setAccessToken(_token) {
        return Promise.resolve();
    }

    getAccessToken() {
        return Promise.resolve(null);
    }

    removeAccessToken() {
        return Promise.resolve();
    }

    setRefreshToken(value) {
        throw new Error("setRefreshToken needs to be implemented by the child class");
    }

    getRefreshToken() {
        return null;
    }

    includeCredentials() {
        return true;
    }

    filterParams(queryData) {
        const filteredParams = Object.entries(queryData || {})
            .filter(([_, value]) => value !== undefined && value !== "null" && value !== null)
            .reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {});

        let queryArgs = new URLSearchParams(filteredParams).toString();
        if (queryArgs !== "") {
            queryArgs = `?${queryArgs}`;
        }

        return queryArgs;
    }

    async request(data) {
        let response = await this.requestInternal(data);
        const isAuthenticated = await this.isAuthenticated();

        if ((response.status === 401 || (response.status === 403 && isAuthenticated)) && data.url !== "/tokens") {
            let beforeRenewAccessToken = await this.getAccessToken();

            const body = { access_token: beforeRenewAccessToken };

            // Include refresh token in body for mobile clients
            if (!this.includeCredentials()) {
                body.refresh_token = this.getRefreshToken();
            }

            const refreshResponse = await this.put("/tokens", body);

            if (refreshResponse.ok) {
                await this.setAccessToken(refreshResponse.body.access_token);

                // Set refresh token from body for mobile clients
                if (!this.includeCredentials()) {
                    this.setRefreshToken(refreshResponse.body.refresh_token);
                }

                response = await this.requestInternal(data);
            }

            // Check no another call was made just before that changed the access and refresh tokens
            const newAccessToken = await this.getAccessToken();
            if (!refreshResponse.ok && (beforeRenewAccessToken !== newAccessToken)) {
                response = await this.requestInternal(data);
            }
        }

        return response;
    }

    async requestInternal(data) {
        const queryArgs = this.filterParams(data.query);
        let response;

        try {
            let body = {
                method: data.method,
                headers: {
                    "Authorization": `Bearer ${await this.getAccessToken()}`,
                    "X-Is-Mobile": !this.includeCredentials(),
                    ...(data.removeContentType ? {} : { "Content-Type": "application/json" }),
                    ...data.headers,
                },
                body: data.body ? data.body instanceof FormData ? data.body : JSON.stringify(data.body) : null,
            };

            // Only include credentials for web clients
            if (this.includeCredentials()) {
                body.credentials = "include";
            }

            response = await fetch(this.base_url + data.url + queryArgs, body);
        }
        catch (error) {
            response = {
                ok: false,
                status: 500,
                json: async () => {
                    return {
                        code: 500,
                        message: "Internal Server Error",
                        description: error.toString(),
                    };
                }
            };
        }

        return {
            ok: response.ok,
            status: response.status,
            body: response.status === 204 ? null : await response.json(),
        };
    };

    async login(username, password) {
        const utf8Bytes = new TextEncoder().encode(`${username}:${password}`);
        const base64Encoded = btoa(String.fromCharCode(...utf8Bytes));

        const response = await this.post("/tokens", JSON.stringify({ username, password }), {
            headers: { Authorization: `Basic ${base64Encoded}` },
        });

        if (!response.ok) {
            throw new APIError(response.status, response.body.message, response.body.description);
        }

        // Set refresh token from body for mobile clients
        if (response.ok && !this.includeCredentials()) {
            this.setRefreshToken(response.body.refresh_token);
        }

        return response;
    };

    async logout() {
        await this.delete("/tokens");
    };

    async register(data) {
        const response = await this.post("/register_user", data);
        if (!response.ok) {
            throw new APIError(
                response.status,
                response.body.message,
                response.body.description,
                response.body?.errors,
            );
        }
        return response;
    };

    async fetchCurrentUser() {
        const isAuthenticated = await this.isAuthenticated();
        if (isAuthenticated) {
            const response = await this.get("/current_user");
            return response.ok ? response.body : null;
        }
        return null;
    };

    async get(url, query, obj) {
        return this.request({ method: "GET", url, query, ...obj });
    };

    async post(url, body, obj) {
        return this.request({ method: "POST", url, body, ...obj });
    };

    async put(url, body, obj) {
        return this.request({ method: "PUT", url, body, ...obj });
    };

    async delete(url, obj) {
        return this.request({ method: "DELETE", url, ...obj });
    };
}


export const initializeApiClient = (ApiClientPlatform, baseApiUrl) => {
    if (!ApiClientPlatform) {
        throw new Error("An ApiClient implementation class must be provided.");
    }
    api = new ApiClientPlatform(baseApiUrl);
};


export const getApiClient = () => {
    if (!api) {
        throw new Error("ApiClient has not been initialized. Please call initializeApiClient first.");
    }
    return api;
};
