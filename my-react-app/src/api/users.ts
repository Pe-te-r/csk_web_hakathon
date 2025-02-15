import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseQuery"; // Import baseQuery
import { UserResponseType, UpdateUserRequest } from "../types";

export const userApi = createApi({
  reducerPath: "userApi",
  tagTypes: ["Users"], 
  baseQuery:baseQueryWithReAuth,
  endpoints: (builder) => ({
    getUsers: builder.query<UserResponseType[], void>({
      query: () => "/users",
      providesTags: ["Users"], 
    }),
getOneUser: builder.query<UserResponseType, { id: string; orders?: boolean }>({
  query: ({ id, orders }) => {
    const queryParams = new URLSearchParams();
    if (orders) queryParams.append("orders", "true");

    return `/users/${id}?${queryParams.toString()}`;
  },
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
updateUserForm: builder.mutation<string, FormData>({
  query: (formData) => {
    const id = formData.get("id");
    if (!id) throw new Error("ID is required in FormData");
    return {
      url: `/users/${id}`,
      method: "PUT",
      body: formData,
    };
  },
  invalidatesTags: ["Users"],
}),


  }),
});

export const { useGetUsersQuery, useUpdateUserMutation,useGetOneUserQuery,useUpdateUserFormMutation } = userApi;
