import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";
/*
 createApi: This function is used to create an API slice, which is a set of endpoints for interacting with your API.

fetchBaseQuery: This function provides a base configuration for making HTTP requests. It allows you to set the base URL and configure other aspects of network requests.
*/

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL });

/* The baseQuery object can be thought of as a preconfigured HTTP client that knows where to send requests based on the base URL you provided.*/


export const apiSlice = createApi({
    baseQuery,
    tagTypes: ["Product", "Order", "User"],
    endpoints: (builder) => {
        return ({});
    }
});

/*
baseQuery: You're passing the baseQuery you created earlier as the base query configuration. This tells Redux Toolkit Query where to send requests.

tagTypes: You're defining an array of tag types. Tag types are used for caching and data invalidation purposes. In this case, you've defined "Product," "Order," and "User" tag types, which you can associate with specific endpoints later on.

endpoints: This is where you define your API endpoints. you'll want to define your API endpoints within the endpoints function. These endpoints will specify how to fetch, create, update, or delete data from your API.

endpoints: (builder) => { 
    return ({
   getUsers: builder.query({
      query: () => "users", // Relative URL for fetching users
   }),
})}


In Redux Toolkit Query, the builder is a parameter provided to the endpoints function. It's a powerful tool that allows you to define your API endpoints with various options and configurations

builder.query: This method is used for defining read-only endpoints that retrieve data from the API. It takes an object as an argument with the following properties:

query: A function that defines how to construct the URL for the request. It typically returns a relative URL or a URL template string.
builder.mutation: This method is used for defining endpoints that modify data on the server, such as creating, updating, or deleting resources. It takes an object as an argument with the following properties:

query: A function that defines the request configuration, including the URL, HTTP method, and request body
*/
