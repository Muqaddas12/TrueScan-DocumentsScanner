import { createSlice, configureStore } from "@reduxjs/toolkit";

const Visibility = createSlice({
    name: "visibility", 
    initialState: {
        value: false
    },
    reducers: {
        Visible: (state) => {
            state.value = true;
        },
        notVisible: (state) => {
            state.value = false;
        }
    }
});


// Export actions
export const { Visible, notVisible } = Visibility.actions;


// Create store
export const store = configureStore({
    reducer: {
        visibility: Visibility.reducer,

    }
});
