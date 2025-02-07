import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "./url";
import { CategoryResponseType,UpdateUserRequest } from "../types";


export const categoryAPi = createApi({
  reducerPath: "categoryAPi",
tagTypes: ["Category"], 
  baseQuery: fetchBaseQuery({ baseUrl: url }),
  endpoints: (builder) => ({
    getAllCategory: builder.query<CategoryResponseType[], void>({
        query: () => "/category",
        providesTags: ["Category"], 
    }),
    updateCategory: builder.mutation<string, UpdateUserRequest>({
      query: ({ id, ...updatedData }) => ({
        url: `/category/${id}`,
        method: "PUT",
        body: updatedData,
        }),
        invalidatesTags: ["Category"], 
    }),
  }),
});

export const { useGetAllCategoryQuery,useUpdateCategoryMutation } = categoryAPi;
