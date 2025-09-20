import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api', 
    timeout: 10000,
    headers: { 
        'Content-Type': 'application/json'
    },
    withCredentials: true,
});

apiClient.interceptors.request.use(
    (config) => {
        if (config.method && ['post', 'put', 'delete', 'patch'].includes(config.method)) {
            const csrfToken = Cookies.get('csrf_token'); 
            if (csrfToken) {
                config.headers['X-CSRF-Token'] = csrfToken;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            
            if (isRefreshing) {
                // ถ้ากำลัง refresh อยู่ ให้เก็บ request นี้ไว้ในคิวแล้วรอ
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => {
                    // เมื่อ refresh เสร็จแล้ว ให้ retry request นี้
                    return apiClient(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await apiClient.post('/auth/refresh');
                
                // เมื่อ refresh สำเร็จ ให้สั่ง retry request ทั้งหมดที่รออยู่ในคิว
                processQueue(null, null);

                // และ retry request ปัจจุบัน
                return apiClient(originalRequest);

            } catch (refreshError) {
                // ถ้า refresh ล้มเหลว ให้เคลียร์คิวและส่ง error ออกไป
                processQueue(refreshError, null);
                
                if (typeof window !== 'undefined') {
                    window.location.href = '/auth/login';
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;