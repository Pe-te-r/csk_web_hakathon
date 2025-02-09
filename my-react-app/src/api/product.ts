import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "./url";
import { ProductRequestType } from "../types";

export const productAPi = createApi({
  reducerPath: "productAPi",
  tagTypes: ["Product"],
  baseQuery: fetchBaseQuery({ baseUrl: url }),
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
