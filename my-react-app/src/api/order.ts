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
      }),
       getAllUserOrders: builder.query({
      query: ({ userId, role }) => {
        let url = `/orders?userId=${userId}`;
        if (role) {
          url += `&role=${role}`;
        }
        return url;
      },
    }),
  }),
});

export const { useSendOrderMutation,useGetAllOrdersQuery,useGetAllUserOrdersQuery } = ordersApi;