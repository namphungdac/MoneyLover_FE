import { createSlice } from "@reduxjs/toolkit";


const initialState = {

    listTransactionSearch: [],
}

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        getListTransactionSearch: (state, action) => {
            state.listTransactionSearch = action.payload
        },

    }
})

export const { getListTransactionSearch} = searchSlice.actions;
export default searchSlice.reducer;

