import { createApi } from "@reduxjs/toolkit/query/react";
import { SubCategoryResponseDetailsType } from "../types";
import { baseQueryWithReAuth } from "./baseQuery";


export const subCategoryApi = createApi({
  reducerPath: "subCategoryApi",
tagTypes: ["SubCategory"], 
  baseQuery: baseQueryWithReAuth,
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
