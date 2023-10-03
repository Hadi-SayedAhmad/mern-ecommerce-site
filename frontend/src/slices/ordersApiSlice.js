
import { apiSlice } from "./apiSlice";
import { ORDERS_URL, PAYPAL_URL } from "../constants";
const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => {
        return {
            createOrder: builder.mutation({
                query: (order) => {
                    return {
                        url: ORDERS_URL,
                        method: "POST",
                        body: {...order}
                    }
                }
            }),
            getOrderDetails: builder.query({
                query: (orderId) => {
                    return {
                        url: `${ORDERS_URL}/${orderId}`
                    }
                },
                keepUnusedDataFor: 10
            }),
            payOrder: builder.mutation({
                query: ({orderId, details}) => {
                    return {
                        url: `${ORDERS_URL}/${orderId}/pay`,
                        method: "PUT",
                        body: {...details}
                    }
                }
            }),
            getPayPalClientId: builder.query({
                query: () => {
                    return {
                        url: PAYPAL_URL,
                    }
                },
                keepUnusedDataFor: 10,
            }),
            getMyOrders: builder.query({
                query: () => {
                    return {
                        url: `${ORDERS_URL}/mine`
                    }
                },
                keepUnusedDataFor: 5
            }),
            getOrders: builder.query({
                query: () => {
                    return {
                        url: `${ORDERS_URL}/`
                    }
                },
                keepUnusedDataFor: 5
            }),
            deliverOrder: builder.mutation({
                query: (orderId) => {
                    return {
                        url: `${ORDERS_URL}/${orderId}/deliver`,
                        method: "PUT"
                    }
                },
            })

        }
    }
})

export const  {useDeliverOrderMutation, useGetOrdersQuery, useCreateOrderMutation, useGetOrderDetailsQuery, usePayOrderMutation, useGetPayPalClientIdQuery, useGetMyOrdersQuery} = ordersApiSlice