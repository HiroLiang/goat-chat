export interface User {
    id: number;
    name?: string;
    email?: string;
    token?: string;
    isLoggedIn?: boolean;
}

export interface UserLoginRequest {
    email: string;
    password: string;
}

export interface UserRegisterRequest {
    email: string;
    name: string;
    password: string;
}

export interface AuthMessageResponse {
    message?: string;
}

export interface CurrentUserResponse {
    id: number
    name: string;
    email: string;
    create_at: string;
}
