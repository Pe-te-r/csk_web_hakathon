import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "./url";
import { CategoryResponseType,UpdateUserRequest ,CategoryResponseDetailsType} from "../types";


export const categoryAPi = createApi({
  reducerPath: "categoryAPi",
tagTypes: ["Category"], 
  baseQuery: fetchBaseQuery({ baseUrl: url }),
  endpoints: (builder) => ({
    getAllCategory: builder.query<CategoryResponseType[], void>({
        query: () => "/category",
        providesTags: ["Category"], 
    }),
    getOneCategoryDetails: builder.query<CategoryResponseDetailsType, { id: string; subcategory?: boolean }>({
        query: ({ id, subcategory=false}) => ({
            url:`/category/${id}?subcategory=${subcategory}`,
            providesTags: ["Category"], 
          })
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

export const { useGetAllCategoryQuery,useUpdateCategoryMutation ,useGetOneCategoryDetailsQuery} = categoryAPi;
