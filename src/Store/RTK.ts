

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

// API
const API = 'https://6a56fbf4b17de7bebbdeaff0.mockapi.io/PEOPLE'


export let getUsers = createAsyncThunk('users/getUsers', async () => {
    let { data } = await axios.get(`${API}`)
    return data
})

// DELETE
export let deleteUser = createAsyncThunk('users/deleteUser', async (id) => {
    await axios.delete(`${API}/${id}`)
    return id
})

// ADD
export let addUser = createAsyncThunk('users/addUser', async (user) => {
    let { data } = await axios.post(API, user)
    return data
})

// EDIT
export let editUser = createAsyncThunk('users/editUser', async (user) => {
    let {data} = await axios.put(`${API}/${user.id}`, user)
    return data
})


let userSlice = createSlice({
    name: "users",
    initialState: {
        data: []
    },
    reducers: {},

    extraReducers: (builder) => {
        builder.addCase(getUsers.fulfilled, (state, action) => {
            state.data = action.payload
        })

        builder.addCase(deleteUser.fulfilled, (state, action) => {
            state.data = state.data.filter((elem) => elem.id !== action.payload)
        })

        builder.addCase(addUser.fulfilled, (state,action) => {
            state.data.push(action.payload)
        })

        builder.addCase(editUser.fulfilled,(state, action) => {
            state.data = state.data.map((elem) => elem.id === action.payload.id ? action.payload : elem)
        })
    }



})


export default userSlice.reducer

