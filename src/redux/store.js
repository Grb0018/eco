import { configureStore } from "@reduxjs/toolkit";
import storeSliceReducer from "../redux/storeSlice"
export const store = configureStore({
    reducer: { storeSlice : storeSliceReducer}
})
