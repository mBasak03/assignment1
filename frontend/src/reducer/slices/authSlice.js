import { createSlice } from "@reduxjs/toolkit";

const initialState= {
    email: null,
    loading: false,
    username: null,
    token: localStorage.getItem("token")? JSON.parse(localStorage.getItem("token")): null
};
const authSlice= createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setUsername(state, value){
            state.username= value.payload
        },
        setEmail(state, value){
            state.email= value.payload
        },
        setToken(state, value){
            state.token= value.payload;
        },
        setLoading(state, value){
            state.loading= value.payload
        }
    }
})

export const {setEmail, setLoading, setToken, setUsername}= authSlice.actions
export default authSlice.reducer;