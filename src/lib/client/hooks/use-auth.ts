import {useQuery} from "@tanstack/react-query";
import {authOptions} from "~/lib/client/react-query";


export const useAuth = () => {
    const { data: currentUser, isLoading, isPending } = useQuery(authOptions);

    return { currentUser: currentUser, isLoading, isPending };
};
