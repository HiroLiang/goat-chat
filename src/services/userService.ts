import { UserLoginRequest } from "@/types/user.ts";
import { http } from "@/api/http.ts";
import { toast } from "sonner";

class UserService {
    async login(email: string, password: string) {
        const request: UserLoginRequest = { email, password };
        const response = await http.post('/api/user/login', request);
        if (response.status !== 200) {
            toast.error('Login failed');
        }
    }

    async register() {
    }

    async logout() {
    }
}

export default UserService;