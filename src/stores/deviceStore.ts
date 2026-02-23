import { create } from 'zustand';
import { type DeviceInfo } from '@/types/device';

interface DeviceState {
    deviceId: string | null;
    platform: string | null;
    registered: boolean;
    createAt: number | null;

    setDeviceId: (deviceId: string | null) => void;
    setPlatform: (platform: string | null) => void;
    setRegistered: (registered: boolean) => void;
    setCreateTime: (createAt: number | null) => void;

    updateDeviceInfo: (deviceInfo: DeviceInfo) => void;
}

export const useDeviceStore = create<DeviceState>((set) => ({
    deviceId: null,
    platform: null,
    registered: false,
    createAt: null,

    setDeviceId: (id: string | null): void => {
        set({ deviceId: id });
    },

    setPlatform: (platform: string | null) => {
        set({ platform: platform });
    },

    setRegistered: (registered: boolean): void => {
        set({ registered: registered })
    },

    setCreateTime: (createAt: number | null): void => {
        set({ createAt: createAt })
    },

    updateDeviceInfo: (deviceInfo: DeviceInfo): void => {
        set({
            deviceId: deviceInfo.device_id,
            platform: deviceInfo.platform,
            registered: deviceInfo.registered,
            createAt: deviceInfo.created_at
        })
    },

}));