import axios from "axios";

export class TransactionService {
    static async getAllCategory() {
        let token = localStorage.getItem('token');
        return await axios.get(`https://moneylover-backend-production.up.railway.app/api/users/categories`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
    }
    static async getAllTransactionOfWallet(walletID) {
        let token = localStorage.getItem('token');
        return await axios.get(`https://moneylover-backend-production.up.railway.app/api/users/wallets/${walletID}/transactions`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
    }
    static async getAllTransactionOfWalletAndType(walletID, startDate, endDate) {
        let token = localStorage.getItem('token');
        return await axios.get(`https://moneylover-backend-production.up.railway.app/api/users/wallets/${walletID}/transactionsType`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    startDate: startDate,
                    endDate: endDate
                }
            }
        )
    }

    static async downloadTransactionOfWallet(walletID, startDate, endDate) {
        let token = localStorage.getItem('token');
        return await axios.get(`https://moneylover-backend-production.up.railway.app/api/users/wallets/${walletID}/ExportExcel`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    startDate: startDate,
                    endDate: endDate
                },
                responseType: "blob", // Yêu cầu dữ liệu kiểu blob (binary)
            }
        )
    }

    static async createTransaction(walletID, data) {
        let token = localStorage.getItem('token');
        return await axios.post(`https://moneylover-backend-production.up.railway.app/api/users/wallets/${walletID}/transactions`, data,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
    }
    static async getInfoTransaction(walletID, transactionID) {
        let token = localStorage.getItem('token');
        return await axios.get(`https://moneylover-backend-production.up.railway.app/api/users/wallets/${walletID}/transactions/${transactionID}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
    }
    static async deleteTransaction(walletID, transactionID, data) {
        let token = localStorage.getItem('token');
        return await axios.delete(`https://moneylover-backend-production.up.railway.app/api/users/wallets/${walletID}/transactions/${transactionID}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
    }
    static async updateTransaction(walletID, transactionID, data) {
        let token = localStorage.getItem('token');
        return await axios.put(`https://moneylover-backend-production.up.railway.app/api/users/wallets/${walletID}/transactions/${transactionID}`, data,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
    }
    static async getTransactionsByTimeRange(walletID, startDate, endDate) {
        let token = localStorage.getItem('token');
        return await axios.get(`https://moneylover-backend-production.up.railway.app/api/users/wallets/${walletID}/report`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    startDate: startDate,
                    endDate: endDate
                }
            }
        )
    }

    static async searchTransactionsByTimeRangeAndCategory(walletID, startDate, endDate, categoryID, startMoney, endMoney) {
        let token = localStorage.getItem('token');
        return await axios.get(`https://moneylover-backend-production.up.railway.app/api/users/wallets/${walletID}/search`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    startDate: startDate,
                    endDate: endDate,
                    categoryID: categoryID,
                    startMoney: startMoney,
                    endMoney: endMoney,
                }
            }
        )
    }

    static async createNewCategory(data) {
        let token = localStorage.getItem('token');
        return await axios.post(`https://moneylover-backend-production.up.railway.app/api/users/categories`, data,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
    }
    static async deleteMyCategory(categoryID) {
        let token = localStorage.getItem('token');
        return await axios.delete(`https://moneylover-backend-production.up.railway.app/api/users/categories/${categoryID}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
    }
    static async updateMyCategory(categoryID, data) {
        let token = localStorage.getItem('token');
        return await axios.put(`https://moneylover-backend-production.up.railway.app/api/users/categories/${categoryID}`, data, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
    }
}