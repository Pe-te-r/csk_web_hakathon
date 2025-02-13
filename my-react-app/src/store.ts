import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/auth";
import { categoryAPi } from "./api/category";
import { productAPi } from "./api/product";
import { userApi } from "./api/users";
import { codeApi } from "./api/code";
import { subCategoryApi } from "./api/sub_category";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [categoryAPi.reducerPath]: categoryAPi.reducer,
    [productAPi.reducerPath]:productAPi.reducer,
    [codeApi.reducerPath]:codeApi.reducer,
    [subCategoryApi.reducerPath]:subCategoryApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware,userApi.middleware,categoryAPi.middleware,subCategoryApi.middleware,productAPi.middleware,codeApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;