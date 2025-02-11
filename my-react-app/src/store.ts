import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/auth";
// import { userAPi } from "./api/users";
import { categoryAPi } from "./api/category";
import { productAPi } from "./api/product";
import { userApi } from "./api/users";
import { codeApi } from "./api/code";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [categoryAPi.reducerPath]: categoryAPi.reducer,
    [productAPi.reducerPath]:productAPi.reducer,
    [codeApi.reducerPath]:codeApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware,userApi.middleware,categoryAPi.middleware,codeApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;