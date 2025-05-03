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

const tempUri=createSlice({
    name:'tempImageUri',
    initialState:{
        uri:null
    },
    reducers:{
        setTempUri:(state,action)=>{
            state.uri=action.payload;
        },
        clearUri:(state,action)=>{
            state.uri=null
        }
    }
})


const uriClearStatus = createSlice({
    name: 'uriClearStatus', // Better name for clarity
    initialState: true, // The state starts as 'true' (indicating URI is clear)
    reducers: {
      // Action to toggle the URI status (true/false)
      setUriClearStatus: (state, action) => {
        return action.payload; // Directly set the state to the payload (true/false)
      },
    },
  });

// Export actions
export const { Visible, notVisible } = Visibility.actions;
export const { setTempUri, clearUri } = tempUri.actions;
export const {setUriClearStatus}=uriClearStatus.actions

// Create store
export const store = configureStore({
    reducer: {
        visibility: Visibility.reducer,
        tempUri: tempUri.reducer,
        uriClearStatus:uriClearStatus.reducer,
    }
});
