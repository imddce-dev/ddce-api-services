import axios from 'axios';
const ls = process.env.NEXT_PUBLIC_API_URL
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
    headers: { 
        'Content-Type': 'application/json'
    },
    withCredentials: true,
});

apiClient.interceptors.request.use(async (config) => {
    if (config.method && ['post', 'put', 'delete', 'patch'].includes(config.method)) {
        try {
            const csrfCookie = await cookieStore.get('csrf_token');
            if (csrfCookie && csrfCookie.value) {
                config.headers['X-CSRF-Token'] = csrfCookie.value;
            }
        } catch (e) {
            console.error("Could not read CSRF token from cookieStore", e);
        }
    }
    return config;
},
(error) => {
    return Promise.reject(error);
}
);

export default apiClient;