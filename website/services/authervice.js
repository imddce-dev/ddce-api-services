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
/**
 * ฟังก์ชันสำหรับลงทะเบียนผู้ใช้ใหม่
 * @param {object} userData
 * @param {string} userData.fullname
 * @param {string} userData.username
 * @param {string} userData.email
 * @param {string} userData.phone 
 * @param {string} userData.organizer
 * @param {string} userData.password
 * @param {boolean}userData.policy
 * @returns {Promise<{success: boolean, message?: string, data?: object}>}
 */
export const register = async(userData) => {
    try{
        const response = await apiClient.post('/users/createusr',userData)
        return response.data;
    }catch(error){
        if (error.response?.status !== 401){
            console.error('An unexpected login error occurred:', error);
        }
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw error;
    }
}

/** 
 *@param {number} userId
 *@param {string} type
*/
export const forgetpassword = async(userId, type) =>{
    try{
        const response = await apiClient.post('/users/logout',{
            userId,
            type
        })
        return response.data
    }catch (error){
        if (error.response?.status !== 401){
            console.error('An unexpected login error occurred:', error)
        }
        if (error.response && error.response.data){
            return error.response.data
        }
        throw error;
    }
}

/**
 * @param {number} userId
 */

export const logout = async(userId) => {
    try{

    }catch (error) {
        if (error.response?.status !== 401){
            console.error('An unexpected login error occurred:', error)
        }
        if (error.response && error.response.data){
            return error.response.data
        }
        throw error;
    }
}