import {authOptions} from "~/lib/react-query";


export type CurrentUser = ReturnType<typeof authOptions>["queryFn"];
