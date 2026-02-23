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

export interface CurrentUserResponse {
    id: number
    name: string;
    email: string;
    create_at: string;
}
