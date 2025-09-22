import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const reviewsApi = createApi({
  reducerPath: 'reviewsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/' }),
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: () => 'reviews'
    }),
    submitReview: builder.mutation({
      query: (review) => ({
        url: 'reviews',
        method: 'POST',
        body: review
      })
    })
  })
});

export const { useGetReviewsQuery, useSubmitReviewMutation } = reviewsApi;
