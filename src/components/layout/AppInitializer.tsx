import * as React from "react";
import { useEffect, useState } from "react";
import { logger } from "@/utils/logger.ts";
import { useDeviceStore } from "@/stores/deviceStore.ts";
import { Overlay } from "@/components/ui/overlay.tsx";
import { deviceService } from "@/services/deviceService.ts";
import { networkService } from "@/services/networkService.ts";

type InitStatus = 'loading' | 'ready' | 'error';

interface InitError {
    message: string;
}

interface Props {
    children: React.ReactNode;
}

export const AppInitializer = ({ children }: Props) => {
    const [status, setStatus] = useState<InitStatus>('loading');
    const [initError, setInitError] = useState<InitError | null>(null);

    const initialize = async () => {
        setStatus("loading");

        // Initialize network state
        await networkService.initialize();

        // Initialize device state
        await deviceService.initializeDevice();

        const deviceState = useDeviceStore.getState();
        if (!deviceState.registered) {
            setStatus('error')
            setInitError({
                message: 'Unable to register device',
            });
            return;
        }

        setStatus("ready");
    }

    useEffect(() => {
        initialize().catch((error) => {
            logger.error('Uncaught initialization error', error);
        });
    }, []);

    return (
        <>
            {children}
            {status !== 'ready' && (
                <Overlay
                    status={status}
                    loading={{ message: 'Initializing...' }}
                    error={initError ? {
                        message: initError.message,
                        onRetry: async () => await initialize(),
                    } : undefined}
                />
            )}
        </>
    );
}