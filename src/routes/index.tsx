import { useRoutes } from "react-router-dom";
import { HomePage } from "../pages/HomePage.tsx";
import { LoginPage } from "@/pages/LoginPage.tsx";
import { RegisterPage } from "@/pages/RegisterPage.tsx";
import { ProtectedRoute } from "@/routes/ProtectedRoute.tsx";
import { ChatPage } from "@/pages/ChatPage.tsx";

const Routes = () => {
    return useRoutes([
        { path: "/", element: <HomePage/> },
        { path: "/login", element: <LoginPage/> },
        { path: "/register", element: <RegisterPage/> },

        {
            element: <ProtectedRoute/>,
            children: [
                { path: "/chat", element: <ChatPage/> }
            ],
        },
    ]);
}

export default Routes;