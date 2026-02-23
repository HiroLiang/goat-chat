import { create } from 'zustand';
import { User } from "@/types/user.ts";

interface UserState {
    currentUser: User | null;
    recordedUsers: Map<string, User>;

    setCurrentUser: (user: User) => void;
}

export const useUserStore = create<UserState>((set) => ({
    currentUser: null,
    recordedUsers: new Map(),

    setCurrentUser: (user) => {
        set((state) => {
            state.currentUser = user;
            state.recordedUsers.set(user.id, user);

            return state;
        });
    }
}));