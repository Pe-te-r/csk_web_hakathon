import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseQuery";

export const codeApi = createApi({
  reducerPath: "codeApi",
  baseQuery:baseQueryWithReAuth,
  endpoints: (builder) => ({
    getRandomCode: builder.query<string, string>({
      query: (id) => `/auth/auth/${id}`,
    }),
    getTotpCode: builder.query<string, string>({
      query:(id) =>  `/auth/totp/${id}`
    }),
    

    verifyCode: builder.mutation<string, { id?: string; code: string }>({
      query: ({ id, code }) => ({
        url: `/auth/auth`,
        method: "POST",
        body: { id, code },
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    verifyTotp: builder.mutation<string, { id?: string; code: string }>({
      query: ({ id, code }) => ({
        url: `/auth/totp`,
        method: "POST",
        body: { id, code },
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),


  }),
});

export const { useGetRandomCodeQuery, useVerifyCodeMutation,useGetTotpCodeQuery,useVerifyTotpMutation } = codeApi;
