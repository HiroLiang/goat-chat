import { useRoutes } from "react-router-dom";
import HomePage from "../pages/HomePage.tsx";
import { LoginPage } from "@/pages/LoginPage.tsx";

const Routes = () => {
    return useRoutes([
        { path: '/', element: <HomePage/> },
        { path: '/login', element: <LoginPage/> },
    ])
}

export default Routes;