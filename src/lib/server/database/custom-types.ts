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


export const imageUrl = (name: string) =>
    customType<{ data: string; driverData: string }>({
        dataType() {
            return "text";
        },
        toDriver(value: string) {
            return value;
        },
        fromDriver(value: string) {
            // NOTE: This '/uploads/' path is served by Nginx. It MUST match the `location` block in the nginx.conf file.
            if (process.env.NODE_ENV === "production") {
                return `${process.env.VITE_BASE_URL}/uploads/recipe-images/${value}`;
            }
            else {
                return `${process.env.VITE_BASE_URL}/static/recipe-images/${value}`;
            }
        },
    })(name);
