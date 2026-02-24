import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import * as React from "react";
import { useUserStore } from "@/stores/userStore.ts";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";
import { userService } from "@/services/userService.ts";

interface NavItem {
    name: string;
    path: string;
    icon?: React.ReactNode;
}

const navItems: NavItem[] = [
    { name: 'Chat Room', path: '/chat' },
];

interface NavbarProps {
    className?: string;
}

export const Navbar = ({ className }: NavbarProps) => {
    const user = useUserStore((state) => state.currentUser);
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await userService.logout();
            toast.success("Logout successfully.");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Logout failed";
            toast.error(message);
        }
    }

    return (
        <nav className={cn(
            'flex items-center justify-between px-4 ',
            'h-16 w-full shadow-md',
            'bg-navbar-bg text-navbar-text',
            className
        )}>

            {/* Left side: logo, navigator options */}
            <div className="flex items-center gap-8 h-full">

                {/* logo */}
                <Link to="/" className="flex items-center h-full gap-2 hover:opacity-80 transition">
                    <div className="h-full w-12 flex items-center justify-center overflow-hidden">
                        <img
                            src="/goat-chat.svg"
                            alt="logo"
                            className="w-full h-full scale-150"
                        />
                    </div>
                    <h1 className="text-xl font-bold">Goat Chat</h1>
                </Link>

                {/* nav options */}
                <div className="flex items-center gap-1 h-full">
                    {navItems.map((item) => {
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-2 px-4 h-full",
                                    "transition-colors",
                                    "bg-navbar-bg text-navbar-text",
                                    "hover:bg-navbar-hover hover:opacity-80",
                                )}
                            >
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

            </ div>


            {/* user info */}
            <div className="flex items-center gap-3">
                {user?.isLoggedIn ? (
                    <div className="flex text-sm justify-between items-center gap-2">
                        <p className="font-medium">User: {user.name}</p>
                        <p
                            className="text-gray-500 text-xs cursor-pointer"
                            onClick={() => logout()}
                        >
                            Logout
                        </p>
                    </div>
                ) : (
                    <Button size="sm"
                            className={"bg-primary text-primary-foreground"}
                            onClick={() => navigate('/login')}>
                        Login
                    </Button>
                )}
            </div>
        </nav>
    )
}
