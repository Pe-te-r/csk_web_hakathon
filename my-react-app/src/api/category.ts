import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "./url";
import { CategoryResponseType,SubCategoryResponseDetailsType} from "../types";

type CategoryRequestType={
  id?:string,
  category:string
}


export const categoryAPi = createApi({
  reducerPath: "categoryAPi",
tagTypes: ["Category"], 
  baseQuery: fetchBaseQuery({ baseUrl: url }),
  endpoints: (builder) => ({
    getAllCategory: builder.query<CategoryResponseType[], void>({
        query: () => "/category",
        providesTags: ["Category"], 
    }),
    getOneCategoryDetails: builder.query<SubCategoryResponseDetailsType, { id: string; subcategory?: boolean }>({
        query: ({ id, subcategory=false}) => ({
            url:`/category/${id}?subcategory=${subcategory}`,
            providesTags: ["Category"], 
          })
      }),
    updateCategory: builder.mutation<string, CategoryRequestType>({
      query: ({ id, ...updatedData }) => ({
        url: `/category/${id}`,
        method: "PUT",
        body: updatedData,
        }),
        invalidatesTags: ["Category"], 
    }),
    addCategory: builder.mutation<string,{category:string}>({
      query: (category) => ({
        url:'/category',
        method: 'POST',
        body:category
      })
    }),
    deleteCategory: builder.mutation<string, { id: string }>({
  query: ({ id }) => ({
    url: `/category/${id}`,
    method: 'DELETE', 
  }),
}),
  }),
});

export const { useGetAllCategoryQuery,useUpdateCategoryMutation ,useGetOneCategoryDetailsQuery,useAddCategoryMutation,useDeleteCategoryMutation} = categoryAPi;
