import { createApi } from "@reduxjs/toolkit/query/react";
import { ProductRequestType } from "../types";
import { baseQueryWithReAuth } from "./baseQuery";

export const productAPi = createApi({
  reducerPath: "productAPi",
  tagTypes: ["Product"],
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    createProduct: builder.mutation<string, FormData>({
      query: (formData) => ({
        url: "/product", 
        method: "POST",
        body: formData, 
      }),
    }),
      getAllProduct: builder.query<ProductRequestType[], void>({
          query:()=>'/product'
      })
  }),
});

export const { useCreateProductMutation,useGetAllProductQuery } = productAPi;
