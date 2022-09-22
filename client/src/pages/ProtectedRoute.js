import { useAppContext } from "../context/appContext.js";
import { Navigate } from "react-router-dom";
const ProtectedRoute = ({ children }) => {
    const { user } = useAppContext();
    if (!user) {
        return <Navigate to="/login" />;
    }
    return children;
};
export default ProtectedRoute;
