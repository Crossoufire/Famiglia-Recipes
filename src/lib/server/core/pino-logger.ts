import pino from "pino";
import {hostname} from "os";
import {createServerOnlyFn} from "@tanstack/react-start";


const pinoLogger = createServerOnlyFn(() => pino({
    level: "info",
    base: {
        pid: process.pid,
        hostname: hostname(),
    },
    timestamp: pino.stdTimeFunctions.isoTime,
}))();


export default pinoLogger;
