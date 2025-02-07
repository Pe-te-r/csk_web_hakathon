import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/auth";
import { userAPi } from "./api/users";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userAPi.reducerPath]: userAPi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware,userAPi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;