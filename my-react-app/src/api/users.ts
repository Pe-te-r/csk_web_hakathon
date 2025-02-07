import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "./url";

interface User {
    first_name: string,
    email: string,
    isActive: boolean,
    
        

}

export const userAPi = createApi({
  reducerPath: "userAPi",
  baseQuery: fetchBaseQuery({ baseUrl: url }),
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "/users",
    }),
  }),
});

export const { useGetUsersQuery } = userAPi;
