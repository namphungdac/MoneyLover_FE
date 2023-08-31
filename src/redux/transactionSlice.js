import { createSlice } from "@reduxjs/toolkit";
import { getMonthNow, getYearNow } from "../components/transactions/TransactionCard";

const initialState = {
    allCategory: [],
    allTransaction: [],
    allTransactionsAndType: [],
    allIncome: [],
    allExpense: [],
    transactionSelect: null,
    dataCategory: [],
    monthSelect: {month: getMonthNow(new Date()), year: getYearNow(new Date())}
}

export const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        getAllCategory: (state, action) => {
            state.allCategory = action.payload
        },
        getAllTransaction: (state, action) => {
            state.allTransaction = action.payload
        },
        getAllTransactionsAndType: (state, action) => {
            state.allTransactionsAndType = action.payload
        },
        setTransactionSelect: (state, action) => {
            state.transactionSelect = action.payload
        },
        getAllIncome: (state, action) => {
            state.allIncome = action.payload
        },
        getAllExpense: (state, action) => {
            state.allExpense = action.payload
        },
        setDataCategory:(state, action) => {
            state.dataCategory = action.payload
        },
        setMonthSelect: (state, action) => {
            state.monthSelect = action.payload
        },
        transactionLogout: (state) => {
            state.allTransaction = [];
            state.allIncome = [];
            state.allExpense = [];
            state.transactionSelect = null;
        },

    }
})

export const { getAllCategory, getAllTransaction, getAllTransactionsAndType, setTransactionSelect, getAllIncome, getAllExpense, setDataCategory, setMonthSelect, transactionLogout } = transactionSlice.actions;
export default transactionSlice.reducer;

