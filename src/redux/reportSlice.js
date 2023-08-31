import { createSlice } from "@reduxjs/toolkit";
import { changeDate } from "../components/datePick/datePick";
import { getTime } from "../components/modals/SelectTimeRangeModal";

const initialState = {
    dateSelect: {firstDay: changeDate(getTime('This month').firstDay), lastDay: changeDate(getTime('This month').lastDay), name: "This month"},
    dataBarChart: {dataIncome: [], dataExpense: []},
    balance: null,
    dataCalculated: null,
    dataByDate: [],
}

export const reportSlice = createSlice({
    name: 'report',
    initialState,
    reducers: {
        setDateSelect: (state, action) => {
            state.dateSelect = action.payload
        },
        getDataBarChart: (state, action) => {
            state.dataBarChart = action.payload
        },
        getBalance: (state, action) => {
            state.balance = action.payload
        },
        setDataCalculated: (state, action) => {
            state.dataCalculated = action.payload
        },
        setDataByDate: (state, action) => {
            state.dataByDate = action.payload
        },
        clearData: (state) => {
           state.dateSelect = {firstDay: changeDate(getTime('This month').firstDay), lastDay: changeDate(getTime('This month').lastDay), name: "This month"};
            state.dataBarChart = {dataIncome: [], dataExpense: []};
            state.balance = null;
            state.dataCalculated = null;
            state.dataByDate = [];
        }
    }
})

export const { setDateSelect, getDataBarChart, getBalance, setDataCalculated , setDataByDate} = reportSlice.actions;
export default reportSlice.reducer;

