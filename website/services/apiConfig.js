import axios from 'axios';
import Cookies from 'js-cookie';
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

export default apiClient;