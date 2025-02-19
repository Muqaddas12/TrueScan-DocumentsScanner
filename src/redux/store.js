import { createSlice,configureStore } from "@reduxjs/toolkit";

const Visibility= createSlice({
    name:'Visibility',
    initialState:{
        value:false
    },
    reducers:{
        Visible:state=>{
            state.value=true
        },
        notVisible:state=>{
            state.value=false
        }
    }
})

export const {Visible,notVisible}= Visibility.actions

export const store = configureStore({
    reducer: Visibility.reducer
})