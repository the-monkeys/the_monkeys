import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { postRequest } from '../../utils/requests'


const initialState = {
  isLoading: false,
  registerError: false,
  registerData:  []
}


export const registerUser =  createAsyncThunk("auth/registerUser",async (data, thunkAPI) => {
    try{
        const response = await postRequest("/auth/register",data)
        return response
    }catch(error){    
        return thunkAPI.rejectWithValue({ error: error });

    }
})



export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // addUser(state, action) {
        //     // this state is not global state. it is only books slice
        //         state.registerData = action.payload;
        //   },    
    },
    extraReducers: (builder ) => {
        builder.addCase(registerUser.pending, (state) => {
              state.isLoading = true
          })
          builder.addCase(
            registerUser.fulfilled, (state, { payload }) => {
               state.registerData = payload.data;
               state.isLoading = false
         });

         builder.addCase(
            registerUser.rejected, (state, action) => {
                state.isLoading = false
               state.registerData = [];
               state.registerError = action.error.message;
            });
    }
  })
  
// export const { addUser } = authSlice.actions



export default authSlice.reducer;

