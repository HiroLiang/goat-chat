import { Toaster } from "sonner";
import Routes from "./routes";
import { AppInitializer } from "@/components/layout/AppInitializer.tsx";
import { NetworkOverlay } from "@/components/layout/NetworkOverlay.tsx";

function App() {

    return (
        <AppInitializer>
            <NetworkOverlay/>
            <Toaster
                position="bottom-right"
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
        </AppInitializer>
    );
}

export default App;