import {randomBytes, scryptSync} from "crypto";


const registerKey = "PUT YOUR REGISTER KEY HERE";
const salt = randomBytes(16).toString("hex");
const hash = scryptSync(registerKey, salt, 64).toString("hex");

console.log(`Your new .env variables:`);
console.log(`REGISTER_KEY_SALT="${salt}"`);
console.log(`REGISTER_KEY_HASH="${hash}"`);
