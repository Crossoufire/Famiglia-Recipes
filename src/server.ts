import dotenv from "dotenv";
import {createRouter} from "~/router";
import {seedLabels} from "~/lib/server/utils/labels-seeder";
import {createStartHandler, defaultStreamHandler} from "@tanstack/react-start/server";


if (process.env.NODE_ENV === "development") {
    dotenv.config({ path: ".env", quiet: true });
}


export default createStartHandler({ createRouter })(defaultStreamHandler);


void seedLabels();
