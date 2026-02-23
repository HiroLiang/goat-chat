import { useNetworkStore } from "@/stores/networkStore.ts";
import { Overlay } from "@/components/ui/overlay.tsx";
import { networkService } from "@/services/networkService.ts";

export const NetworkOverlay = () => {
    const status = useNetworkStore((state) => state.networkStatus);
    const online = useNetworkStore((state) => state.browserOnline);

    if (!online) {
        return (
            <Overlay
                status="error"
                error={{
                    message: 'No internet connection. Please check your network settings.',
                }}
            />
        );
    }

    if (status === 'healthy') return null;

    if (status === 'unreachable' || status === 'unhealthy') {
        return (
            <Overlay
                status="error"
                error={{
                    message: status === 'unreachable'
                        ? 'Cannot connect to server.'
                        : 'Server is currently unavailable.',
                    onRetry: () => networkService.recheck(),
                }}
            />
        );
    }

    return (
        <Overlay
            status="loading"
            loading={{ message: 'Connecting to server...' }}
        />
    );
}