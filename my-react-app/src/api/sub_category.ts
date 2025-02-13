import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "./url";
import { SubCategoryResponseDetailsType } from "../types";


export const subCategoryApi = createApi({
  reducerPath: "subCategoryApi",
tagTypes: ["SubCategory"], 
  baseQuery: fetchBaseQuery({ baseUrl: url }),
  endpoints: (builder) => ({
    deleteSubCategory: builder.mutation<string, { id: string }>({
  query: ({ id }) => ({
    url: `/subcategory/${id}`,
    method: 'DELETE', 
  }),
}),
    getAllSubCategory: builder.query<SubCategoryResponseDetailsType[], { category_name: boolean }>({
      query: ({ category_name }) => ({
        url: "/subcategory",
        providesTags: ["SubCategory"],
        params:{category_name}
      })
    }),
    
    addSubCategory: builder.mutation<string, {category_id:string,subcategory:string}>({
      query: ({ ...updatedData }) => ({
        url: `/subcategory`,
        method: "POST",
        body: updatedData,
        }),
        invalidatesTags: ["SubCategory"], 
    }),
    updateSubCategory: builder.mutation<string, {subcategory:string,id:string}>({
      query: ({ id, ...updatedData }) => ({
        url: `/subcategory/${id}`,
        method: "PUT",
        body: updatedData,
        }),
        invalidatesTags: ["SubCategory"], 
    }),
    
  }),
});

export const { useGetAllSubCategoryQuery,useUpdateSubCategoryMutation, useDeleteSubCategoryMutation,useAddSubCategoryMutation} = subCategoryApi;
