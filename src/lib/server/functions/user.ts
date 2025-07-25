import {auth} from "~/lib/server/core/auth";
import {scryptSync, timingSafeEqual} from "crypto";
import {createServerFn} from "@tanstack/react-start";
import {getWebRequest} from "@tanstack/react-start/server";


export const getCurrentUser = createServerFn({ method: "GET" }).handler(async () => {
    const { headers } = getWebRequest();
    const session = await auth.api.getSession({ headers });

    if (!session?.user) {
        return null;
    }

    return {
        ...session.user,
        id: parseInt(session.user.id),
    };
});


export const validateKey = createServerFn({ method: "GET" })
    .validator((data: string) => data)
    .handler(async ({ data: submittedKey }) => {
        const salt = process.env.REGISTER_KEY_SALT as string;
        const keyHash = process.env.REGISTER_KEY_HASH as string;

        const submittedKeyHash = scryptSync(submittedKey, salt, 64);
        const storedKeyHash = Buffer.from(keyHash, "hex");

        return timingSafeEqual(submittedKeyHash, storedKeyHash);
    });
