import {useNavigate} from "react-router-dom";
import {useUser} from "@/providers/UserProvider";


export const PublicRoute = ({ children }) => {
    const { currentUser } = useUser();
    const navigate = useNavigate();

    if (currentUser === undefined) {
        return null;
    }
    else if (currentUser) {
        return navigate("/dashboard");
    }
    else {
        return children;
    }
};


