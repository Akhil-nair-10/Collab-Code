import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        async function checkAuthentication() {
            try {
                await axios.get("http://localhost:3000/auth/check", {
                    withCredentials: true
                });

                setIsAuthenticated(true);
            } catch (error) {
                setIsAuthenticated(false);
            }
        }

        checkAuthentication();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;