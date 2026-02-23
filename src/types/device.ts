export interface DeviceInfo {
    device_id: string;
    platform: string;
    registered: boolean;
    created_at: number;
}

export interface DeviceRegistrationRequest {
    device_id: string;
    device_name: string;
    platform: string;
}

export interface DeviceRegistrationResponse {
    success: boolean;
    device_id: string;
    message?: string;
}