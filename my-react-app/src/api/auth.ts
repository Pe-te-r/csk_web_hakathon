import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RegisterRequest, RegisterResponse } from "../types";
import { url } from "./url";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl:url }),
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