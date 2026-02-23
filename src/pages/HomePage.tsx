import { Navbar } from "@/components/layout/Navbar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useDeviceStore } from "@/stores/deviceStore.ts";
import { deviceService } from "@/services/deviceService.ts";
import { logger } from "@/utils/logger.ts";

export default function HomePage() {
    const deviceState = useDeviceStore();

    const printDeviceInfo = () => {
        logger.info('get state: ', deviceState);
    }

    const initDevice = async () => {
        await deviceService.initializeDevice();
    }

    const reload = async () => {
        await deviceService.resetDevice();
        await deviceService.initializeDevice();
    }

    return (
        <>
            <Navbar/>
            <div>Home</div>
            <div className="flex gap-4">
                <Button onClick={() => printDeviceInfo()}>get state</Button>
                <Button onClick={() => initDevice()}>init Device</Button>
                <Button onClick={() => reload()}>reset</Button>
            </div>
        </>
    )
}