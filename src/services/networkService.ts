import { NetworkState, useNetworkStore } from "@/stores/networkStore.ts";
import { logger } from "@/utils/logger.ts";
import { toast } from "sonner";

class NetworkService {
    private initialized: boolean = false;
    private pollingInterval: ReturnType<typeof setInterval> | null = null;

    async initialize(): Promise<void> {
        const store: NetworkState = useNetworkStore.getState();

        if (!this.initialized) {
            window.addEventListener('online', () => {
                logger.info('Browser went online');
                store.setBrowserOnline(true);
                toast.success('Network connection restored', { duration: 3000 });
                store.checkConnection();
            });

            window.addEventListener('offline', () => {
                logger.info('Browser went offline');
                store.setBrowserOnline(false);
                toast.error('Network connection lost');
            });

            this.startPolling();
            this.initialized = true;
        }

        await this.checkInitialConnection();
    }

    async recheck(): Promise<boolean> {
        const store = useNetworkStore.getState();

        const toastId = toast.loading('Checking network connection...');
        const isOnline = await store.checkConnection();
        toast.dismiss(toastId);

        if (isOnline) {
            toast.success('Network connection restored');
        } else {
            toast.error('Cannot connect to server');
        }

        return isOnline;
    }

    private async checkInitialConnection(): Promise<void> {
        const store: NetworkState = useNetworkStore.getState();

        logger.info('Checking initial connection...');

        const isOnline = await store.checkConnection();
        if (!isOnline) {
            toast.error('Failed to connect to server', {
                description: 'Please check your internet connection and try again',
                duration: 3000
            });
        } else {
            logger.info('Connected to server');
        }
    }

    startPolling(intervalMs = 30_000) {
        const store = useNetworkStore.getState();
        this.stopPolling();
        this.pollingInterval = setInterval(async () => {
            await store.checkConnection();
        }, intervalMs);
    }

    stopPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
    }
}

export const networkService = new NetworkService();