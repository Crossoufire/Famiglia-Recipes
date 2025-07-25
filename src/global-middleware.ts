import {registerGlobalMiddleware} from "@tanstack/react-start";
import {errorMiddleware} from "~/lib/server/middleware/global-error";


registerGlobalMiddleware({
    middleware: [errorMiddleware],
})
