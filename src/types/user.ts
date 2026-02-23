export interface User {
    id: string;
    name: string;
    email: string;
    token: string;

    isLoggedIn: boolean;
}

export interface UserLoginRequest {
    email: string;
    password: string;
}

