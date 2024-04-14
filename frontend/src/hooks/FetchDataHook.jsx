import useSWR from "swr";
import {useApi} from "@/providers/ApiProvider";


export const useFetchData = (url, query, options) => {
    const api = useApi();

    const fetcher = async () => {
        const response = await api.get(url, query, options);

        if (!response.ok) {
            throw {
                status: response.status,
                message: response.body.message,
                description: response.body.description,
            };
        }

        return response.body.data;
    }

    const { data, isLoading, error, mutate } = useSWR([url, query, options], fetcher);

    return { apiData: data, loading: isLoading, error, mutate };
};
