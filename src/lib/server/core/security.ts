import crypto from "node:crypto";
import {createServerOnlyFn} from "@tanstack/react-start";


export const checkWerkzeugPassword = createServerOnlyFn(() => (password: string, pwhash: string) => {
    const parts = pwhash.split("$");

    if (parts.length !== 3) {
        throw new Error("Invalid hash format");
    }

    const [method, salt, storedHash] = parts;

    if (method.startsWith("scrypt")) {
        return checkScryptHash(password, salt, storedHash);
    }
    else {
        throw new Error(`Unsupported hash method: ${method}`);
    }
})();


export const generatePasswordHash = createServerOnlyFn(() => (password: string, method: string = "scrypt", saltLength: number = 16) => {
    const salt = generateSalt(saltLength);
    const hash = hashPassword(method, salt, password);
    return `${method}$${salt}$${hash}`;
})();


const checkScryptHash = createServerOnlyFn(() => (password: string, salt: string, storedHash: string) => {
    const n = 32768;
    const r = 8;
    const p = 1;
    const keyLen = 64;
    const maxmem = 1024 * 1024 * 1024;

    const derivedKey = crypto.scryptSync(password, Buffer.from(salt, "utf-8"), keyLen, { N: n, r, p, maxmem });
    const calculatedHash = derivedKey.toString("hex");

    return crypto.timingSafeEqual(
        Buffer.from(storedHash, "hex"),
        Buffer.from(calculatedHash, "hex")
    );
})();


const generateSalt = createServerOnlyFn(() => (length: number) => {
    const randomBytes = crypto.randomBytes(Math.ceil(length * 3 / 4));
    const base64Salt = randomBytes.toString("base64").replace(/\+/g, ".").replace(/\//g, "_").replace(/=/g, "");
    return base64Salt.substring(0, length);
})();


const hashPassword = createServerOnlyFn(() => (method: string, salt: string, password: string) => {
    if (method === "scrypt" || method.startsWith("scrypt:")) {
        const n = 32768;
        const r = 8;
        const p = 1;
        const keyLen = 64;
        const maxmem = 1024 * 1024 * 1024;

        const derivedKey = crypto.scryptSync(password, Buffer.from(salt, "utf-8"), keyLen, { N: n, r, p, maxmem });
        return derivedKey.toString("hex");
    }
    else {
        throw new Error(`Unsupported hash method: ${method}`);
    }
})();
