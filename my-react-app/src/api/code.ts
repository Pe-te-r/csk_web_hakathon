import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "./url";

export const codeApi = createApi({
  reducerPath: "codeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: url,
    prepareHeaders: (headers) => {
      // Retrieve token from localStorage
      const user = localStorage.getItem("user");
      const token = user ? JSON.parse(user).token : null;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
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
