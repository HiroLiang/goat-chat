import axios, { AxiosError } from 'axios';
import { env } from "@/config/env.ts";
import { logger } from "@/utils/logger.ts";
import { useUserStore } from "@/stores/userStore.ts";

export const http = axios.create({
    baseURL: env.API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    },
});

// Request interceptor
http.interceptors.request.use(
    config => {
        logger.info(`Request: ${config.method?.toUpperCase()} ${config.url}`);

        // Set auth header
        const userStore = useUserStore.getState();
        const token = userStore.currentUser?.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => {
        logger.error('Request Error', error);
        return Promise.reject(error);
    }
);

// Response interceptor
http.interceptors.response.use(
    response => {
        logger.info(
            `Response: ${response.status} ${response.config.url}`,
            response.data
        );

        const newToken = response.headers['authorization'] || response.headers['Authorization'];

        if (newToken) {

            // Remove Bearer prefix
            const token = newToken.startsWith('Bearer ')
                ? newToken.slice(7)
                : newToken;

            // Update user token
            const userStore = useUserStore.getState();
            const currentUser = userStore.currentUser;

            if (currentUser) {
                userStore.setCurrentUser({
                    ...currentUser,
                    token: token,
                });

                logger.info('Token refreshed');
            }
        }

        return response;
    },
    error => Promise.reject(error)
);