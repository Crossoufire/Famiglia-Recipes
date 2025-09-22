import {authOptions} from "~/lib/react-query";
import {useQuery} from "@tanstack/react-query";


export const useAuth = () => {
    const { data: currentUser, isLoading, isPending } = useQuery(authOptions);

    return { currentUser: currentUser, isLoading, isPending };
};
