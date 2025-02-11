import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "./url";

export const codeAPi = createApi({
  reducerPath: "codeAPi",
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
  }),
});

export const { useGetRandomCodeQuery } = codeAPi;
