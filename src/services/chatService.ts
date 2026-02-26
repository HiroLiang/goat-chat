import { wsService } from "./wsService.ts";
import { logger } from "@/utils/logger.ts";

class ChatService {
    initialize() {
        wsService.on('new_message', (payload) => {
            logger.info('New message received:', payload);
        });

        wsService.on('typing_indicator', (payload) => {
            logger.info('Typing indicator received:', payload);
        });
    }

    sendMessage(conversationId: string, content: string) {
        wsService.send('chat_message', { conversationId, content });
    }

    sendTyping(conversationId: string) {
        wsService.send('typing', { conversationId });
    }
}

export const chatService = new ChatService();