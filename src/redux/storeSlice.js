import { createSlice } from "@reduxjs/toolkit";

let initState = {
    men : [],
    women : [],
    user :[]
}

export const storeSlice = createSlice({
    name: "storeSlice",
    initialState : initState,
    reducers:{
        addMenProduct : (state,action) =>{
            
            state.men= [...action.payload]
        },
        addWomenProduct : (state,action) =>{
            state.women= [...action.payload]
        },
        addUser : (state,action) =>{
            console.log(action)
            state.user= [...action.payload]
        },
        addToCart : (state,action) =>{
            console.log(action)
            state.user[0].cart= [...action.payload]
        }
    }
})

export const { addMenProduct , addWomenProduct, addUser ,addToCart} = storeSlice.actions
export default storeSlice.reducer