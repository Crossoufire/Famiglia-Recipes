import {createStart} from "@tanstack/react-start";
import {errorMiddleware} from "~/lib/server/middleware/global-error";


export const startInstance = createStart(() => {
    return {
        functionMiddleware: [errorMiddleware],
    }
})
