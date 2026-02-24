import { http } from "@/api/http.ts";
import { useUserStore } from "@/stores/userStore.ts";
import {
  AuthMessageResponse,
  CurrentUserResponse,
  UserLoginRequest,
  UserRegisterRequest,
} from "@/types/user.ts";

class UserService {
  async login(email: string, password: string): Promise<AuthMessageResponse> {
    const request: UserLoginRequest = { email, password };
    const response = await http.post<AuthMessageResponse>("/api/user/login", request);

    const currentUser = await this.fetchCurrentUser();
    this.setAuthenticatedUser(currentUser);

    return response.data;
  }

  async register(payload: UserRegisterRequest): Promise<AuthMessageResponse> {
    const response = await http.post<AuthMessageResponse>("/api/user/register", payload);
    return response.data;
  }

  async logout(): Promise<void> {
    await http.post("/api/user/logout");

    const state = useUserStore.getState();
    state.setCurrentUser({
      id: 0,
      name: undefined,
      token: undefined,
      email: undefined,
      isLoggedIn: false,
    });
  }

  async fetchCurrentUser(): Promise<CurrentUserResponse> {
    const response = await http.get<CurrentUserResponse>("/api/user/me");
    return response.data;
  }

  private setAuthenticatedUser(user: CurrentUserResponse): void {
    const state = useUserStore.getState();
    state.setCurrentUser({
      id: user.id,
      email: user.email,
      name: user.name,
      isLoggedIn: true,
    });
  }
}

export const userService = new UserService();
