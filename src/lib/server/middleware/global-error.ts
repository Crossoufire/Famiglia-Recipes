import z from "zod/v4";
import {createMiddleware} from "@tanstack/react-start";
import pinoLogger from "~/lib/server/core/pino-logger";
import {sendAdminErrorMail} from "~/lib/server/utils/mail-sender";
import {FormattedError, FormZodError} from "~/lib/server/utils/error-classes";


function createCleanError(originalError: Error, message?: string) {
    const cleanError = new Error(message ? message : originalError.message);
    cleanError.name = originalError.name;
    delete cleanError.stack;

    return cleanError;
}


const isProduction = process.env.NODE_ENV === "production";


/**
 * Error Types and Logic
 * Error - `notFound`: not thrown but returned and handled frontend side by tanstack router.
 * Error - FormattedError: Expected Error with pre-formatted message for frontend side.
 * Error - FormattedError(sendMail: true): Error not supposed to happen but pre-formatted message and send mail.
 * Error - FormZodError: Error occurred during Form submission, return the whole error.
 * Error - ZodError: Unexpected Error on (POST) validation, send admin email, return generic error message.
 * Error - Error: Unexpected Error anywhere, send admin email, return generic error message.
 **/
export const errorMiddleware = createMiddleware({ type: "function" }).server(async ({ next }) => {
    try {
        return await next();
    }
    catch (error: unknown) {
        if (!isProduction) {
            console.error("DEV Error:", error);
        }

        if (error instanceof FormattedError) {
            pinoLogger.info({ err: error }, `FormattedError Caught: ${error.message}`);
            if (isProduction && error.sendMail) {
                await sendAdminErrorMail(error, "Specific Formatted Error Occurred");
            }

            throw createCleanError(error);
        }

        if (error instanceof FormZodError) {
            throw error;
        }

        let errorMessageForLog = "Unexpected Error";
        const originalError = error instanceof Error ? error : new Error(String(error));
        if (error instanceof z.ZodError) {
            errorMessageForLog = "Unexpected Zod validation error";
            originalError.message = "A validation error occurred. Please try again later.";
        }

        pinoLogger.error({ err: originalError }, errorMessageForLog);

        if (isProduction) {
            await sendAdminErrorMail(originalError, errorMessageForLog);
        }

        throw createCleanError(originalError, "An unexpected error occurred. Please try again later.");
    }
});
