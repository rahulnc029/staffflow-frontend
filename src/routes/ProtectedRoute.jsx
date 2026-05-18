import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const token = localStorage.getItem("token");

    if (!token || !user) {
        return <Navigate to="/" />
    }

    if (user.role !== allowedRole) {
        if(user.role === "Admin") {
            return (
                <Navigate to="/admin/dashboard"/>
            );
        }
        if(user.role === "Manager") {
            return(
                <Navigate to="/manager/dashboard"/>
            );
        }

        return(
            <Navigate to="/user/dashboard"/>
        )
    }

    return children;
}

export default ProtectedRoute;