import { PRODUCTS_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => {
        return ({
            getProducts: builder.query({
                query: ({currPage, keyword}) => {
                    return ({
                        url: PRODUCTS_URL,
                        params: {
                            currPage,
                            keyword
                        }
                    
                    })
                },
                keepUnusedDataFor: 10,
                providesTags: ["Product"]
            }),
            getProductDetails: builder.query({
                query: (productId) => {
                    return {
                        url: `${PRODUCTS_URL}/${productId}`
                    }
                },
                keepUnusedDataFor: 5
            }),
            createProduct: builder.mutation({
                query: () => {
                    return {
                        url: PRODUCTS_URL,
                        method: "POST",
                    }
                },
                invalidatesTags: ["Product"] //stop data from being cached so it will stay fresh so that we don't need to refresh page
            }),
            // updateStock: builder.mutation({
            //     query: (items) => {
            //         return {
            //             url: `${PRODUCTS_URL}`,
            //             method: "PUT",
            //             body: items
            //         }
            //     }
            // })
            updateProduct: builder.mutation({
                query: (data) => {
                    return {
                        url: `${PRODUCTS_URL}/${data.productId}`,
                        method: "PUT",
                        body: data
                    }
                },
                invalidatesTags: ["Product"]
            }),
            uploadProductImage: builder.mutation({
                query: (data) => {
                    return {
                        url: `${UPLOAD_URL}`,
                        method: "POST",
                        body: data
                    }

                }
            }),
            deleteProduct: builder.mutation({
                query: (productId) => {
                    return {
                        url: `${PRODUCTS_URL}/${productId}`,
                        method: "DELETE"
                    }
                }
            }),
            createReview: builder.mutation({
                query: (data) => {
                    return {
                        url: `${PRODUCTS_URL}/${data.productID}/reviews`,
                        method: "POST",
                        body: data
                    }
                },
                invalidatesTags: ["Product"]
            }),
            getTopProducts: builder.query({
                query: () => {
                    return {
                        url: `${PRODUCTS_URL}/top`
                    }
                },
                keepUnusedDataFor: 5
            })

        })
    }
})

export const {  useGetTopProductsQuery, useCreateReviewMutation, useDeleteProductMutation, useUploadProductImageMutation, useUpdateProductMutation, useGetProductsQuery, useGetProductDetailsQuery, useCreateProductMutation } = productsApiSlice;