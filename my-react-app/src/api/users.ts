import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "./url";
import { UserResponseType,UpdateUserRequest } from "../types";


export const userAPi = createApi({
  reducerPath: "userAPi",
tagTypes: ["Users"], 
  baseQuery: fetchBaseQuery({ baseUrl: url }),
  endpoints: (builder) => ({
    getUsers: builder.query<UserResponseType[], void>({
        query: () => "/users",
        providesTags: ["Users"], 
    }),
    updateUser: builder.mutation<string, UpdateUserRequest>({
      query: ({ id, ...updatedData }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: updatedData,
        }),
        invalidatesTags: ["Users"], 
    }),
  }),
});

export const { useGetUsersQuery,useUpdateUserMutation } = userAPi;
