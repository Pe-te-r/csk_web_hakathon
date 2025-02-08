import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "./url";
import { CategoryResponseType,UpdateUserRequest } from "../types";


export const subCategoryApi = createApi({
  reducerPath: "subCategoryApi",
tagTypes: ["SubCategory"], 
  baseQuery: fetchBaseQuery({ baseUrl: url }),
  endpoints: (builder) => ({
    getAllSubCategory: builder.query<CategoryResponseType[], void>({
        query: () => "/subcategory",
        providesTags: ["SubCategory"], 
    }),
    updateSubCategory: builder.mutation<string, UpdateUserRequest>({
      query: ({ id, ...updatedData }) => ({
        url: `/subcategory/${id}`,
        method: "PUT",
        body: updatedData,
        }),
        invalidatesTags: ["SubCategory"], 
    }),

  }),
});

export const { useGetAllSubCategoryQuery,useUpdateSubCategoryMutation } = subCategoryApi;
