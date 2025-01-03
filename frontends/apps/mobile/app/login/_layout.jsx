import {Redirect, Slot} from "expo-router";
import {useAuth} from "@famiglia-recipes/api";


export default function LoginLayout() {
    const { currentUser, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    if (currentUser) {
        return <Redirect href="/dashboard"/>;
    }

    return <Slot/>;
}
