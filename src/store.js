import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./redux/auth/authSlice";
import articleEditorReducer from "./redux/articleEditor/articleEditorSlice"
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  auth: authReducer,
  articleEditor: articleEditorReducer
});

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
