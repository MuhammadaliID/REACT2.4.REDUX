import { configureStore } from '@reduxjs/toolkit'
import userReducer from './RTK'

export const store = configureStore({
  reducer: {
    users: userReducer
  }
})