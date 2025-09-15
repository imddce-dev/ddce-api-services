import apiClient from './apiConfig'
/**
 * ฟังก์ชันสำหรับ Login
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export const login = async (username, password) => {
    try {
        const response = await apiClient.post('/users/login', { 
            username,
            password,
        });
        return response.data;
    } catch (error) {
        console.error('Login failed:', error);
        if (error.response && error.response.data) {
            return error.response.data; 
        }
        throw error;
    }
};


