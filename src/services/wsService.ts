import { useNetworkStore } from "@/stores/networkStore.ts";
import { logger } from "@/utils/logger.ts";
import { toast } from "sonner";
import { useUserStore } from "@/stores/userStore.ts";

type MessageHandler = (data: unknown) => void;

type WSStatus = "idle" | "connecting" | "connected" | "reconnecting" | "disconnected";

class WebSocketService {
    private ws: WebSocket | null = null;
    private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    private heartbeatTimer: ReturnType<typeof setInterval> | null = null;

    private reconnectDelay = 3000;
    private maxReconnectDelay = 30000;

    private handlers: Map<string, Set<MessageHandler>> = new Map();
    private messageQueue: string[] = [];

    private url = "";
    private token: string | null = null;

    private status: WSStatus = "idle";

    getStatus() {
        return this.status;
    }

    connect(url: string, token?: string) {
        this.url = url;
        this.token = token ?? null;

        const userState = useUserStore.getState();
        if (!userState.currentUser?.isLoggedIn) {
            logger.warn('Cannot connect to websocket server. User is not logged in.');
            toast.error('Please login first.');
            return;
        }

        const netState = useNetworkStore.getState();
        if (netState.networkStatus !== 'healthy') {
            logger.warn('Cannot connect to websocket server. Network is not healthy.');

            switch (netState.networkStatus) {
                case "offline":
                    toast.error('Offline, please check your internet connection.');
                    break;
                case "connecting":
                    toast.error('Connecting to server... Please try again later.');
                    break;
                default:
                    toast.error('Cannot connect to websocket server. Please retry later.');
                    break;
            }

            return;
        }

        this.createConnection();
    }

    disconnect() {
        this.clearReconnectTimer();
        this.stopHeartbeat();

        this.ws?.close(1000, "manual disconnect");
        this.ws = null;
        this.status = "disconnected";

        logger.info("WebSocket disconnected");
    }

    forceReconnect() {
        logger.info("Force reconnect");
        this.disconnect();
        this.reconnectDelay = 3000;
        this.createConnection();
    }

    send(type: string, payload: unknown) {
        const message = JSON.stringify({
            type,
            payload,
            timestamp: Date.now(),
        });

        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(message);
        } else {
            logger.warn("Socket not open, queue message", { type });
            this.messageQueue.push(message);
        }
    }

    on(type: string, handler: MessageHandler) {
        if (!this.handlers.has(type)) {
            this.handlers.set(type, new Set());
        }
        this.handlers.get(type)!.add(handler);
    }

    off(type: string, handler: MessageHandler) {
        this.handlers.get(type)?.delete(handler);
    }

    private createConnection() {
        if (!this.url) return;
        if (this.ws?.readyState === WebSocket.OPEN) return;

        this.status = this.ws ? "reconnecting" : "connecting";

        const finalUrl = this.token ? `${this.url}?token=${this.token}` : this.url;

        logger.info('WebSocket connecting...', { url: finalUrl });

        this.ws = new WebSocket(finalUrl);

        // on connected
        this.ws.onopen = () => {
            logger.info('WebSocket connected');

            this.status = "connected";
            this.reconnectDelay = 3000;
            this.flushQueue();
            this.startHeartbeat();
        };

        this.ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);

                // Heartbeat response
                if (message.type === "pong") return;

                const handlers = this.handlers.get(message.type);
                handlers?.forEach((h) => h(message.payload));
            } catch (err) {
                logger.error("WebSocket parse error", err);
            }
        };

        this.ws.onclose = (event) => {
            this.stopHeartbeat();

            if (event.code === 1000) {
                this.status = "disconnected";
                return;
            }

            logger.warn("WebSocket closed, reconnecting...", {
                code: event.code,
            });

            this.scheduleReconnect();
        };

        this.ws.onerror = (err) => {
            logger.error("WebSocket error", err);
        };
    }

    private scheduleReconnect() {
        this.clearReconnectTimer();

        this.reconnectTimer = setTimeout(() => {
            this.reconnectDelay = Math.min(
                this.reconnectDelay * 2,
                this.maxReconnectDelay
            );

            this.createConnection();
        }, this.reconnectDelay);
    }

    private clearReconnectTimer() {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
    }

    private flushQueue() {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        while (this.messageQueue.length > 0) {
            const msg = this.messageQueue.shift();
            if (msg) this.ws.send(msg);
        }
    }

    private startHeartbeat() {
        this.stopHeartbeat();

        this.heartbeatTimer = setInterval(() => {
            if (this.ws?.readyState === WebSocket.OPEN) {
                this.ws.send(
                    JSON.stringify({
                        type: "ping",
                        timestamp: Date.now(),
                    })
                );
            }
        }, 20000);
    }

    private stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }
}

export const wsService = new WebSocketService();