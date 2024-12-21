import {ApiClient} from "@famiglia-recipes/api";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";


export class ApiClientMobile extends ApiClient {
    async setAccessToken(token) {
        await AsyncStorage.setItem("access_token", token);
    }

    async getAccessToken() {
        return await AsyncStorage.getItem("access_token");
    }

    async removeAccessToken() {
        await AsyncStorage.removeItem("access_token");
    }

    setRefreshToken(token) {
        SecureStore.setItem("refresh_token", token);
    }

    getRefreshToken() {
        return SecureStore.getItem("refresh_token");
    }

    includeCredentials() {
        return false;
    }
}
