import { Toaster } from "sonner";
import Routes from "./routes";
import { deviceService } from "@/services/deviceService.ts";
import { useEffect } from "react";
import { logger } from "@/utils/logger.ts";

function App() {

    useEffect(() => {
        const init = async () => {
            await deviceService.initializeDevice();
        }

        init().catch((error) => {
            logger.error('Uncaught initialization error', error);
        });
    }, []);

    // const isInitialized = useDeviceStore((state) => state.isInitialized);
    // const networkStatus = useNetworkStore((state) => state.networkStatus);
    // const [initError, setInitError] = useState<string | null>(null);
    //
    // useEffect(() => {
    //     const init = async () => {
    //         try {
    //             logger.info('Starting app initialization...');
    //
    //             // 1. Initialize network service
    //             await networkService.initialize();
    //
    //             const networkStore = useNetworkStore.getState();
    //             if (!networkStore.browserOnline) {
    //                 throw {
    //                     type: 'network',
    //                     message: 'No internet connection. Please check your network settings and try again.'
    //                 };
    //             }
    //
    //             if (networkStore.networkStatus === 'unreachable') {
    //                 throw {
    //                     type: 'server',
    //                     message: 'Cannot connect to server'
    //                 };
    //             }
    //
    //             if (networkStore.networkStatus === 'unhealthy') {
    //                 throw {
    //                     type: 'server',
    //                     message: 'Server returned error'
    //                 };
    //             }
    //
    //             // 2. Initialize device store
    //             await useDeviceStore.getState().initDevice();
    //
    //             logger.info('App initialization completed.');
    //         } catch (error) {
    //             const errorMessage = error instanceof Error
    //                 ? error.message
    //                 : 'Unknown error occurred';
    //
    //             logger.error('App initialization failed', error);
    //             setInitError(errorMessage);
    //
    //             // Error toast
    //             toast.error('Initialization Failed', {
    //                 description: errorMessage,
    //                 action: {
    //                     label: 'Retry',
    //                     onClick: () => {
    //                         setInitError(null);
    //                         init();
    //                     },
    //                 },
    //             });
    //         }
    //     };
    //
    //     init().catch((error) => {
    //         logger.error('Uncaught initialization error', error);
    //     });
    // }, []);
    //
    // // Error state
    // if (initError) {
    //     return (
    //         <div className="flex items-center justify-center h-screen bg-zinc-950">
    //             <div className="text-center max-w-md px-4">
    //                 <div className="text-red-500 text-6xl mb-4">⚠️</div>
    //                 <h1 className="text-2xl font-bold text-zinc-100 mb-2">
    //                     Initialization Failed
    //                 </h1>
    //                 <p className="text-zinc-400 mb-6">{initError}</p>
    //                 <button
    //                     onClick={() => {
    //                         setInitError(null);
    //                         useDeviceStore.getState().initDevice().catch(error => {
    //                             logger.error('Failed to retry initialization', error);
    //                         })
    //                     }}
    //                     className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    //                 >
    //                     Retry
    //                 </button>
    //             </div>
    //         </div>
    //     );
    // }
    //
    // // Loading state
    // if (!isInitialized || networkStatus !== 'healthy') {
    //     return (
    //         <div className="flex items-center justify-center h-screen bg-zinc-950">
    //             <div className="text-center">
    //                 <div
    //                     className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-zinc-100 border-r-transparent"></div>
    //                 <p className="mt-4 text-zinc-400 text-lg">Initializing...</p>
    //
    //                 {/* Network Status Indicator */}
    //                 <div className="mt-6 flex items-center justify-center gap-2">
    //                     <div className={`w-2 h-2 rounded-full ${
    //                         networkStatus === 'healthy' ? 'bg-green-500' :
    //                             networkStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
    //                                 'bg-red-500'
    //                     }`}></div>
    //                     <span className="text-zinc-500 text-sm">
    //           {networkStatus === 'healthy' ? 'Connected' :
    //               networkStatus === 'connecting' ? 'Connecting...' :
    //                   networkStatus === 'unreachable' ? 'Server Unreachable':
    //                       'No Internet Connection'}
    //         </span>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

    // Rendered app
    return (
        <>
            <Toaster
                position="top-right"
                richColors
                toastOptions={{
                    classNames: {
                        toast: "bg-zinc-900 text-zinc-100 border border-zinc-700",
                        success: "bg-emerald-600 border-emerald-500",
                        error: "bg-red-600 border-red-500",
                        warning: "bg-orange-600 border-orange-500",
                        info: "bg-blue-600 border-blue-500",
                    },
                }}
            />
            <Routes/>
        </>
    );
}

export default App;