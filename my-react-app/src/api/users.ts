import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "./url";
import { UserResponseType, UpdateUserRequest } from "../types";

export const userApi = createApi({
  reducerPath: "userApi",
  tagTypes: ["Users"], 
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
    getUsers: builder.query<UserResponseType[], void>({
      query: () => "/users",
      providesTags: ["Users"], 
    }),
    getOneUser: builder.query<UserResponseType, string>({
      query:(id)=> `/users/${id}`,
      providesTags:['Users']
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
