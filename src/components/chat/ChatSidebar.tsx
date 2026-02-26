import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { ChatGroup } from '@/types/chat';
import { Bot, ChevronLeft, ChevronRight, MessageSquare, Plus, Users } from 'lucide-react';

interface ChatSidebarProps {
    chats: ChatGroup[];
    selectedChatId: string | null;
    onSelectChat: (id: string) => void;
    onAddDirectContact: () => void;
    collapsed: boolean;
    onToggleCollapse: () => void;
}

const avatarBgClass: Record<ChatGroup['type'], string> = {
    DIRECT: 'bg-primary text-primary-foreground',
    GROUP: 'bg-blue-500 text-white',
    CHANNEL: 'bg-purple-500 text-white',
    BOT: 'bg-amber-500 text-white',
};

const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

function ChatAvatar({ chat }: { chat: ChatGroup }) {
    return (
        <div className={cn(
            'h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm relative',
            avatarBgClass[chat.type],
        )}>
            {chat.type === 'GROUP'
                ? <Users className="h-5 w-5"/>
                : chat.type === 'BOT'
                    ? <Bot className="h-5 w-5"/>
                    : getInitials(chat.name)}

            {chat.type !== 'GROUP' && (
                <span className={cn(
                    'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background',
                    chat.isOnline ? 'bg-green-500' : 'bg-zinc-400',
                )}/>
            )}
        </div>
    );
}

export function ChatSidebar({
                                chats,
                                selectedChatId,
                                onSelectChat,
                                onAddDirectContact,
                                collapsed,
                                onToggleCollapse,
                            }: ChatSidebarProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredChats = chats.filter((chat) =>
        chat.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );

    return (
        <div className={cn(
            'flex flex-col h-full border-r border-border bg-sidebar-bg flex-shrink-0',
            'transition-[width] duration-300 ease-in-out overflow-hidden',
            collapsed ? 'w-16' : 'w-72',
        )}>
            {/* Header */}
            <div className={cn(
                'h-14 flex items-center border-b border-border flex-shrink-0',
                collapsed ? 'justify-center px-2' : 'px-4 justify-between',
            )}>
                {!collapsed && (
                    <div className="flex items-center gap-2 text-foreground">
                        <MessageSquare className="h-4 w-4"/>
                        <span className="font-semibold text-sm">Chats</span>
                    </div>
                )}
                <button
                    onClick={onToggleCollapse}
                    className="rounded-md p-1.5 hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                    title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {collapsed
                        ? <ChevronRight className="h-4 w-4"/>
                        : <ChevronLeft className="h-4 w-4"/>}
                </button>
            </div>

            {!collapsed && (
                <div className="px-2 py-2 border-b border-border">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search chats..."
                        className="w-full rounded-md border border-input bg-background px-3 py-2
                        text-sm text-foreground placeholder:text-muted-foreground
                        outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                </div>
            )}

            {/* Chat list */}
            <div className="flex-1 min-h-0 overflow-y-auto py-2 px-2">
                {filteredChats.map((chat) => (
                    <button
                        key={chat.id}
                        onClick={() => onSelectChat(chat.id)}
                        title={collapsed ? chat.name : undefined}
                        className={cn(
                            'w-full rounded-lg p-2 transition-colors text-left',
                            'hover:bg-accent flex items-center gap-3',
                            selectedChatId === chat.id && 'bg-accent',
                            collapsed && 'justify-center',
                        )}
                    >
                        <div className="relative">
                            <ChatAvatar chat={chat}/>
                            {collapsed && !!chat.unreadCount && chat.unreadCount > 0 && (
                                <span
                                    className="absolute -top-1 -right-1 h-4 min-w-4 px-0.5 rounded-full bg-destructive
                                    text-destructive-foreground text-[10px] font-bold flex items-center justify-center"
                                >
                                    {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                                </span>
                            )}
                        </div>

                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                    <span className="font-medium text-sm truncate">{chat.name}</span>
                                    <span
                                        className="text-xs text-muted-foreground flex-shrink-0">{chat.lastMessageTime}</span>
                                </div>
                                <div className="flex items-center justify-between gap-1 mt-0.5">
                                    <span className="text-xs text-muted-foreground truncate">{chat.lastMessage}</span>
                                    {!!chat.unreadCount && chat.unreadCount > 0 && (
                                        <span
                                            className="h-4 min-w-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                                            {chat.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </button>
                ))}
                {!collapsed && filteredChats.length === 0 && (
                    <p className="px-3 py-6 text-center text-sm text-muted-foreground">No chats found</p>
                )}
            </div>

            <div className="border-t border-border p-2">
                {collapsed ? (
                    <button
                        onClick={onAddDirectContact}
                        className="w-full inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent transition-colors"
                        title="New Contact"
                    >
                        <Plus className="h-4 w-4"/>
                    </button>
                ) : (
                    <button
                        onClick={onAddDirectContact}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
                    >
                        <Plus className="h-4 w-4"/>
                        New Contact
                    </button>
                )}
            </div>
        </div>
    );
}
