import {customType} from "drizzle-orm/sqlite-core";


export const customJson = <TData>(name: string) =>
    customType<{ data: TData; driverData: string }>({
        dataType() {
            return "text";
        },
        toDriver(value: TData) {
            return JSON.stringify(value);
        },
        fromDriver(value: string): TData {
            return JSON.parse(value);
        }
    })(name);


export const imageUrl = (name: string, staticPath: string = "/static/recipe-images") =>
    customType<{ data: string; driverData: string }>({
        dataType() {
            return "text";
        },
        toDriver(value: string) {
            return value;
        },
        fromDriver(value: string) {
            const baseUrl = process.env.VITE_BASE_URL;
            return `${baseUrl}${staticPath}/${value}`;
        },
    })(name);
