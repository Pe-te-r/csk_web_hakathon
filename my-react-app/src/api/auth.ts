import { createApi } from "@reduxjs/toolkit/query/react";
import { RegisterRequest, RegisterResponse } from "../types";
import { baseQueryWithReAuth } from "./baseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
      login: builder.mutation({
          query: (userData) => ({
              url: '/auth/login',
              method: 'POST',
              body:userData
          })
      })
  }),
});

export const { useRegisterMutation,useLoginMutation } = authApi;