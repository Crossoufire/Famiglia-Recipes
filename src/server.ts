import {createRouter} from "~/router";
import {seedLabels} from "~/lib/server/utils/labels-seeder";
import {createStartHandler, defaultStreamHandler} from "@tanstack/react-start/server";


export default createStartHandler({ createRouter })(defaultStreamHandler);


void seedLabels();
