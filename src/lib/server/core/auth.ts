import {clientEnv} from "~/env/client";
import {serverEnv} from "~/env/server";
import {betterAuth} from "better-auth";
import {db} from "~/lib/server/database/db";
import {sendEmail} from "~/lib/utils/mail-sender";
import {createServerOnlyFn} from "@tanstack/react-start";
import {reactStartCookies} from "better-auth/react-start";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import {checkWerkzeugPassword, generatePasswordHash} from "~/lib/server/core/security";


const getAuthConfig = createServerOnlyFn(() => betterAuth({
    appName: "Famiglia-Recipes",
    baseURL: clientEnv.VITE_BASE_URL,
    secret: serverEnv.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, {
        provider: "sqlite",
    }),
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "user",
                returned: true,
                input: false,
            }
        }
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
        },
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        minPasswordLength: 8,
        maxPasswordLength: 128,
        requireEmailVerification: true,
        resetPasswordTokenExpiresIn: 3600,
        sendResetPassword: async ({ user, url }) => {
            await sendEmail({
                link: url,
                to: user.email,
                username: user.name,
                template: "resetPassword",
                subject: "Famiglia-Recipes - Reset your password",
            });
        },
        password: {
            hash: async (password: string) => {
                return generatePasswordHash(password);
            },
            verify: async ({ hash, password }) => {
                return checkWerkzeugPassword(password, hash);
            },
        },
    },
    emailVerification: {
        expiresIn: 3600,
        sendOnSignUp: true,
        sendOnSignIn: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            const dashboardUrl = url + "dashboard";
            await sendEmail({
                to: user.email,
                link: dashboardUrl,
                username: user.name,
                template: "register",
                subject: "Famiglia-Recipes - Verify your email address",
            });
        },
    },
    advanced: {
        cookiePrefix: "famiglia-recipes",
        database: {
            useNumberId: true,
        },
    },
    plugins: [
        reactStartCookies(),
    ]
}));


export const auth = getAuthConfig();
