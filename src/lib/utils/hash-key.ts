import {randomBytes, scryptSync} from "crypto";
import {createServerOnlyFn} from "@tanstack/react-start";


const createRegisterKeyHashAndSalt = createServerOnlyFn(() => (registerKey: string) => {
    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(registerKey, salt, 64).toString("hex");

    console.log(`Your new .env variables:`);
    console.log(`REGISTER_KEY_SALT="${salt}"`);
    console.log(`REGISTER_KEY_HASH="${hash}"`);
})();


const args = process.argv.slice(2);
if (args.length === 0) {
    console.error("Error: Please provide the register key as a command-line argument.");
    console.error('Usage: npx tsx src/lib/utils/hash-key.ts -- "your-secret-key-here"');
    process.exit(1);
}


createRegisterKeyHashAndSalt(args[0]);
