import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "./url";

const baseQuery = fetchBaseQuery({
  baseUrl: url,
    prepareHeaders: (headers) => {
        const user = localStorage.getItem("user");
        const token = user ? JSON.parse(user).token : null;
        if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
  },
});

export const baseQueryWithReAuth: typeof baseQuery = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    const error =result.error?.data as {message:string}

  if (result.error && (result.error.status === 401 || result.error.status === 403)&&(error.message === 'Invalid token.' || error.message === 'Expired token.')) {
    localStorage.removeItem("user"); 
    window.location.href = "/login"; 
  }

  return result;
};
