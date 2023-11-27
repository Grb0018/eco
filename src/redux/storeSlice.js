import { createSlice } from "@reduxjs/toolkit";

let initState = {
    men : [],
    women : [],
}

export const storeSlice = createSlice({
    name: "storeSlice",
    initialState : initState,
    reducers:{
        addMenProduct : (state,action) =>{
            
            state.men= [...action.payload]
        },
        addWomenProduct : (state,action) =>{
            state.men= [...action.payload]
        }
    }
})

export const { addMenProduct , addWomenProduct } = storeSlice.actions
export default storeSlice.reducer