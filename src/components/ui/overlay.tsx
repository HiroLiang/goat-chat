import { useNetworkStore } from "@/stores/networkStore.ts";
import { AlertTriangle } from "lucide-react";

interface LoadingOverlayProps {
    message?: string;
}

interface ErrorOverlayProps {
    message: string;
    onRetry?: () => void;
}

interface OverlayProps {
    status: 'loading' | 'error';
    loading?: LoadingOverlayProps;
    error?: ErrorOverlayProps;
}

function LoadingContent({ message = 'Loading...' }: LoadingOverlayProps) {
    const networkStatus = useNetworkStore((state) => state.networkStatus);

    return (
        <div className="text-center">
            <div
                className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-zinc-100 border-r-transparent"/>
            <p className="mt-4 text-zinc-400 text-lg">{message}</p>
            <div className="mt-6 flex items-center justify-center gap-2">
                <div className={`w-2 h-2 rounded-full transition-colors ${
                    networkStatus === 'healthy' ? 'bg-green-500' :
                        networkStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                            'bg-red-500'
                }`}/>
                <span className="text-zinc-500 text-sm">
                    {networkStatus === 'healthy' ? 'Connected' :
                        networkStatus === 'connecting' ? 'Connecting...' :
                            networkStatus === 'unreachable' ? 'Server Unreachable' :
                                'No Internet Connection'}
                </span>
            </div>
        </div>
    );
}

function ErrorContent({ message, onRetry }: ErrorOverlayProps) {
    return (
        <div className="text-center max-w-md px-4">
            <div className="flex items-center justify-center gap-2">
                <AlertTriangle className="w-32 h-32 text-primary-foreground"/>
            </div>
            <h1 className="text-2xl font-bold text-zinc-100 mb-2">Something went wrong</h1>
            <p className="text-zinc-400 mb-6">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className={
                        "px-6 py-2 bg-background text-foreground rounded-lg transition" +
                        "hover:bg-primary hover:text-primary-foreground hover:opacity-75"
                    }
                >
                    Retry
                </button>
            )}
        </div>
    );
}

export function Overlay({ status, loading, error }: OverlayProps) {
    const isError = status === 'error';

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-colors ${
            isError ? 'bg-zinc-950/90 backdrop-blur-sm' : 'bg-zinc-950'
        }`}>
            {status === 'loading' && <LoadingContent {...loading}/>}
            {status === 'error' && error && <ErrorContent {...error}/>}
        </div>
    );
}