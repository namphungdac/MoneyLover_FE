import {createSlice} from "@reduxjs/toolkit";

const languageSlice = createSlice({
    name: "lang",
    initialState: {
        lang: "En"
    },
    reducers: {
        setLanguage: (state, action) => {
            state.lang = action.payload
        }
    }
})

export const {
    setLanguage
} = languageSlice.actions;

export default languageSlice.reducer;