import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseQuery";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    sendOrder: builder.mutation({
      query: (orderData) => ({
        url: "/orders",
        method: "POST",
        body: orderData,
      }),
    }),
      getAllOrders: builder.query({
          query:()=>'/orders'
      })
  }),
});

export const { useSendOrderMutation,useGetAllOrdersQuery } = ordersApi;