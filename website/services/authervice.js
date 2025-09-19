import apiClient from './apiConfig'
/**
 * @param {string} message - ข้อความสำหรับแสดงผลที่ UI
 * @param {string|null} errorCode - รหัสข้อผิดพลาดสำหรับตรวจสอบเงื่อนไข
 * @param {number|null} status - HTTP status code
 */
class ApiError extends Error {
  constructor(message, errorCode = null, status = null) {
    super(message);
    this.name = 'ApiError';
    this.errorCode = errorCode;
    this.status = status;
  }
}
/**
 * @param {object} userLogin
 * @param {string} userLogin.username
 * @param {string} userLogin.password
 * @returns {Promise<object>} 
 * @throws {ApiError} 
 */

export const login = async (userLogin) => {
  try {
    const response = await apiClient.post('/users/login', userLogin);
    return response.data;
    
  } catch (error) {
    if (error.response) {
      const { data, status } = error.response; 
      if (status === 429) {
        throw new ApiError(
          data?.message || 'Too many login attempts. Please try again in a few minutes.',
          'RATE_LIMIT_EXCEEDED', 
          status
        );
      }
      throw new ApiError(
        data?.message || 'An error occurred during login.',
        data?.errorCode || 'UNKNOWN_API_ERROR',
        status
      );
    }
    else if (error.request) {
      throw new ApiError(
        'Unable to connect to the server. Please check your network connection.',
        'NETWORK_ERROR'
      );
    }
    else {
      throw new ApiError('An unexpected error occurred.', 'UNEXPECTED_ERROR');
    }
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