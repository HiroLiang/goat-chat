import { NetworkState, useNetworkStore } from "@/stores/networkStore.ts";
import { logger } from "@/utils/logger.ts";
import { toast } from "sonner";

class NetworkService {
    private initialized: boolean = false;

    async initialize(): Promise<void> {
        if (this.initialized) return;

        const store: NetworkState = useNetworkStore.getState();

        window.addEventListener('online', () => {
            logger.info('Browser went online');
            store.setBrowserOnline(true);
            toast.success('Network connection restored');
            store.checkConnection();
        });

        window.addEventListener('offline', () => {
            logger.info('Browser went offline');
            store.setBrowserOnline(false);
            toast.error('Network connection lost');
        });

        this.initialized = true;

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

        logger.info('Checking initial connection');

        const isOnline = await store.checkConnection();
        if (!isOnline) {
            toast.error('Failed to connect to server', {
                description: 'Please check your internet connection and try again',
                duration: 10000
            });
        }
    }
}

export const networkService = new NetworkService();