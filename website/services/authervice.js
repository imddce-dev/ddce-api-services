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
        if (error.response?.status !== 401) {
            console.error('An unexpected login error occurred:', error);
        }
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw error;
    }
};


