import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import articleEditorReducer from "./articleEditor/articleEditorSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  auth: authReducer,
  articleEditor: articleEditorReducer,
});

// Your async action using createAsyncThunk (replace this with your actual async action)
// const fetchSomeData = createAsyncThunk('someData/fetch', async () => {
//   // Fetch some data from API or perform async operation
// });

const persistConfig = {
  key: "root",
  blacklist: ['articleEditor'],
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const reduxStore = () => {
  let store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
  let persistor = persistStore(store);
  return {
    store,
    persistor,
  };
};
