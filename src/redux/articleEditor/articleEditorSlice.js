import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../api";

const { addImage, getImage, deleteImage } = API();

const initialState = {
  imagesUploaded: [],

  isLoadingPostImage: false,
  postImageData: [],
  errorPostImage: false,

  isLoadingGetImage: false,
  getImageData: [],
  errorGetImage: false,

  isLoadingDeleteImage: false,
  deleteImageData: [],
  errorDeleteImage: false,
};

export const addImageData = createAsyncThunk(
  "articleEditor/addImage",
  async (data, thunkAPI) => {
    try {
      return addImage(data?.formData, data?.config, data?.url);
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error });
    }
  }
);

export const getImageData = createAsyncThunk(
  "articleEditor/getImage",
  async (data, thunkAPI) => {
    try {
      console.log("iojsadf", data);
      return getImage(data?.config, data?.url);
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error });
    }
  }
);

export const deleteImageData = createAsyncThunk(
  "articleEditor/deleteImage",
  async (data, thunkAPI) => {
    try {
      console.log("iojsadf", data);
      return deleteImage(data?.config, data?.url);
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error });
    }
  }
);

export const articleEditorSlice = createSlice({
  name: "articleEditor",
  initialState, 
  reducers: {
    updateUploadedImages: (state, action) => {    

      state.imagesUploaded.push( action.payload)

    },

    deleteUnusedImage : (state, action) => {

      state.imagesUploaded = state.imagesUploaded.filter(item => item.isDeleted === false)


      state.imagesUploaded.forEach (item => {
        if(item.fileName === action.payload.fileName){
          item.isDeleted = true;
        }
      })




    // return {
    //    ...state,
    //    imagesUploaded: [...state.imagesUploaded].filter(item => item.fileName !== action.payload.fileName)
    // };
        
        // console.log(state.imagesUploaded, 'after state update')

    }
  },  
  extraReducers: (builder) => {
    builder.addCase(addImageData.pending, (state) => {
      state.isLoadingPostImage = true;
    });
    builder.addCase(addImageData.fulfilled, (state, { payload }) => {
      state.postImageData = payload;
      state.isLoadingPostImage = false;
      state.errorPostImage = false;
    });
    builder.addCase(addImageData.rejected, (state, action) => {
      state.isLoadingPostImage = false;
      state.postImageData = [];
      state.errorPostImage = action.error.message;
    });

    builder.addCase(getImageData.pending, (state) => {
      state.isLoadingGetImage = true;
    });
    builder.addCase(getImageData.fulfilled, (state, { payload }) => {
      state.getImageData = payload;
      state.isLoadingGetImage = false;
      state.errorGetImage = false;
    });
    builder.addCase(getImageData.rejected, (state, action) => {
      state.isLoadingGetImage = false;
      state.getImageData = [];
      state.errorGetImage = action.error.message;
    });

    builder.addCase(deleteImageData.pending, (state) => {
      state.isLoadingDeleteImage = true;
    });
    builder.addCase(deleteImageData.fulfilled, (state, { payload }) => {
      state.deleteImageData = payload;
      state.isLoadingDeleteImage = false;
      state.errorDeleteImage = false;



     // console.log(data)  


      // return {
      //  ...state,
      //   imagesUploaded: [...state.imagesUploaded].filter(item => item.fileName !== action.payload.fileName)
      // };



    });
    builder.addCase(deleteImageData.rejected, (state, action) => {
      state.isLoadingDeleteImage = false;
      state.deleteImageData = [];
      state.errorDeleteImage = action.error.message;
    });
  },
});

export const { updateUploadedImages, deleteUnusedImage } = articleEditorSlice.actions;

export default articleEditorSlice.reducer;
