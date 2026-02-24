# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install          # Install dependencies
pnpm tauri dev        # Run full dev server (Vite frontend + Tauri/Rust backend)
pnpm dev              # Run Vite frontend only
pnpm build            # tsc + vite build
pnpm tauri build      # Production desktop build
```

No test framework is configured in this project.

## Architecture

**Goat Chat** is a cross-platform desktop chat app built with React 19 + Tauri (Rust backend). The frontend runs on Vite at port 1420 during development.

### State Management

Three Zustand stores in `src/stores/`:
- `userStore` — current user session (token, login state) and cached users
- `deviceStore` — device ID and registration state
- `networkStore` — network health status (`'offline' | 'connecting' | 'healthy' | 'unhealthy' | 'unreachable'`)

### Service Layer (`src/services/`)

Services handle initialization logic and are called from `AppInitializer` (in `src/components/layout/`) on app startup:
- `deviceService` — registers device via Tauri command (`get_or_create_device_info`) or falls back to browser UUID; syncs with backend
- `networkService` — polls backend health endpoint every 30s and listens to browser online/offline events
- `userService` — user-facing operations (login, register)

### HTTP Client (`src/api/`)

Axios instance configured with:
- Base URL from `VITE_API_BASE_URL` env var
- Request interceptor: attaches Bearer token from `userStore`
- Response interceptor: refreshes token if server returns a new one; handles errors uniformly

### Routing (`src/routes/`)

- `/` → `HomePage` (currently a device debug/test page)
- `/login` → `LoginPage`
- `/register` → `RegisterPage`
- `/chat` → `ChatPage` (protected — redirects to `/login` if unauthenticated)

### Tauri Backend (`src-tauri/`)

Rust commands exposed to frontend in `src-tauri/src/commands/device.rs`:
- `get_or_create_device_info` — reads or generates device UUID, stored in `store.json` via tauri-plugin-store
- `update_device_registration` — marks device as registered
- `clear_device_id` — resets device info

### UI

Uses **shadcn/ui** (new-york style, zinc base) with Radix UI + Tailwind CSS. Components live in `src/components/ui/`. Import path alias: `@/` maps to `src/`.

### Environment

| File | Purpose |
|------|---------|
| `.env` | Production API (`https://api.hiroliang.com`) |
| `.env.local` | Local API (`http://localhost:8080`) |

Typed access via `src/config/env.ts` using `env.API_BASE_URL` and `env.IS_DEV`.

### Logger (`src/utils/logger.ts`)

Dual-mode: uses `tauri-plugin-log` when running in Tauri, falls back to console in browser. Dev-only levels: trace, debug.
