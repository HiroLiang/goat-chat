import { create } from 'zustand';
import { User } from "@/types/user.ts";

interface UserState {
    currentUser: User | null;
    recordedUsers: Map<number, User>;

    setCurrentUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
    currentUser: { id: 0 },
    recordedUsers: new Map(),

    setCurrentUser: (user: User | null) => {
        set((state) => ({
            currentUser: user ? {
                ...state.currentUser,
                ...user,
            } : null,
            recordedUsers: user
                ? new Map(state.recordedUsers).set(user.id, user)
                : state.recordedUsers,
        }));
    }

}));