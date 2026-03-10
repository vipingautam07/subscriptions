import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FullScreenLoader from "./FullScreenLoader";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <FullScreenLoader />;

    if (!isAuthenticated) return <Navigate to="/signin" replace />;

    return children;
}

export default ProtectedRoute;