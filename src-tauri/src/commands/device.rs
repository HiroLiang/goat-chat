use serde::{Deserialize, Serialize};
use serde_json::json;
use tauri_plugin_store::StoreExt;
use uuid::Uuid;
use chrono::Utc;

#[allow(dead_code)]
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct DeviceInfo {
    pub device_id: String,
    pub platform: String,
    pub registered: bool,
    pub created_at: i64,
}

#[allow(dead_code)]
#[tauri::command]
pub fn get_or_create_device_info(app: tauri::AppHandle) -> Result<DeviceInfo, String> {
   let store = app.store("store.json").map_err(|e| e.to_string())?;

    // Check if device_info exists
    if let Some(device_info_value) = store.get("device_info") {
        if let Ok(device_info) = serde_json::from_value::<DeviceInfo>(device_info_value) {
            return Ok(device_info);
        }
    }

    // Create device_info
    let device_info = DeviceInfo {
        device_id: Uuid::new_v4().to_string(),
        platform: std::env::consts::OS.to_string(),
        registered: false,
        created_at: Utc::now().timestamp_millis(),
    };

    // Save device_info
    store.set("device_info", json!(device_info));
    store.save().map_err(|e| e.to_string())?;

    Ok(device_info)
}

#[allow(dead_code)]
#[tauri::command]
pub fn update_device_registration(
    app: tauri::AppHandle,
    registered: bool,
) -> Result<(), String> {
    let store = app.store("store.json").map_err(|e| e.to_string())?;

    if let Some(device_info_value) = store.get("device_info") {
        if let Ok(mut device_info) = serde_json::from_value::<DeviceInfo>(device_info_value) {
            device_info.registered = registered;
            store.set("device_info", json!(device_info));
            store.save().map_err(|e| e.to_string())?;
            return Ok(());
        }
    }

    Err("Device info not found".to_string())
}

#[allow(dead_code)]
#[tauri::command]
pub fn clear_device_id(app: tauri::AppHandle) -> Result<(), String> {
    let store = app.store("store.json").map_err(|e| e.to_string())?;

    store.delete("device_info");
    store.save().map_err(|e| e.to_string())?;

    Ok(())
}