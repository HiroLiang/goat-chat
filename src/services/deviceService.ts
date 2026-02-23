import { DeviceInfo, DeviceRegistrationRequest, DeviceRegistrationResponse } from "@/types/device.ts";
import { invoke, isTauri } from "@tauri-apps/api/core";
import { logger } from "@/utils/logger.ts";
import { http } from "@/api/http.ts";
import { useDeviceStore } from "@/stores/deviceStore.ts";

class DeviceService {

    async initializeDevice(): Promise<void> {
        const state = useDeviceStore.getState();
        if (!isTauri()) {
            state.updateDeviceInfo({
                device_id: 'dev-device-id',
                platform: 'macbook',
                registered: true,
                created_at: new Date().getTime(),
            });
            return;
        }

        const deviceInfo = await this.getOrCreateDeviceInfo();

        if (!deviceInfo.registered) {
            try {
                const rs = await this.registerDevice(deviceInfo.device_id);
                state.setRegistered(rs.success);
            } catch (error) {
                state.setRegistered(false);
            }
        }

        state.updateDeviceInfo(deviceInfo);
    }

    async resetDevice(): Promise<void> {
        if (isTauri()) {
            await invoke('clear_device_id');

        }

        const state = useDeviceStore.getState();
        state.setDeviceId(null);
        state.setPlatform(null);
        state.setRegistered(false);
        state.setCreateTime(null);
    }

    private async getOrCreateDeviceInfo(): Promise<DeviceInfo> {
        try {
            return await invoke<DeviceInfo>('get_or_create_device_info');
        } catch (err) {
            logger.error("Error getting device info:", err);
            throw err;
        }
    }

    private async registerDevice(deviceId: string): Promise<DeviceRegistrationResponse> {
        try {
            const payload: DeviceRegistrationRequest = {
                device_id: deviceId,
                device_name: 'Goat Chat',
                platform: 'macOS'
            };

            const response = await http.post<DeviceRegistrationResponse>(
                '/api/device/register',
                payload
            );

            logger.info("Device registered successfully:", response.data);

            if (response.data.success) {
                await invoke('update_device_registration', { registered: true })
            }

            return response.data;
        } catch (err) {
            logger.error("Error register device:", err);
            throw err;
        }

    }
}

export const deviceService = new DeviceService();