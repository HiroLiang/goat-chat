import { useUserStore } from "@/stores/userStore.ts";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
    const user = useUserStore((state) => state.currentUser);

    if (!user?.isLoggedIn) {
        return <Navigate to="/login" replace/>;
    }

    return <Outlet/>
}