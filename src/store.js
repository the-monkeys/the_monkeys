import { configureStore, combineReducers } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'

const rootReducer = combineReducers({
    auth: authReducer,
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }),

},)