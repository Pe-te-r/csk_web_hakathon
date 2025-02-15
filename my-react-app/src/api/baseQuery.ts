import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "./url";

// Base Query Setup with JWT Handling
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

// Custom Query Handler to Handle Expired Tokens
export const baseQueryWithReAuth: typeof baseQuery = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
    console.log('here one')
    console.log(result.error)
  if (result.error && (result.error.status === 401 || result.error.status === 403)) {
      console.log("Token expired or invalid. Logging out...");
      console.log(result.error.data)
    // localStorage.removeItem("user"); // Remove token
    // window.location.href = "/login"; // Redirect to login
  }

  return result;
};
