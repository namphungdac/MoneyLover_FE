import axios from "axios";

export class UserService {
    static async getAll() {
        return await axios.get('https://moneylover-backend-production.up.railway.app/api/users');
    }
    static async checkUserLogin(data) {
        return await axios.post('https://moneylover-backend-production.up.railway.app/api/login', data);
    }
    static async createUser(data) {
        return await axios.post('https://moneylover-backend-production.up.railway.app/api/register', data);
    }
    static async deleteUser(accessToken) {
        return await axios.delete(`https://moneylover-backend-production.up.railway.app/api/users`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
    }
    static async updateUser(data) {
        let token = localStorage.getItem('token');
        return await axios.put(`https://moneylover-backend-production.up.railway.app/api/users`, data,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
    }
    static async verifyEmail(tokenVerifyEmail) {
        return await axios.get(`https://moneylover-backend-production.up.railway.app/api/verify/${tokenVerifyEmail}`)
    }

    static async resetPassword(data){
        return await axios.post(`https://moneylover-backend-production.up.railway.app/api/reset-password`, data)
    }
    static async sendReport (userID, token){
        return await axios.get(`https://moneylover-backend-production.up.railway.app/api/users/${userID}/send-report`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
    }
}