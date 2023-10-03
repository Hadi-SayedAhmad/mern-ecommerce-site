import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
    const { userInfo } = useSelector((state) => {
        return state.auth
    });

    return userInfo ? <Outlet></Outlet> : <Navigate to="/login" replace />






}

export default PrivateRoute;