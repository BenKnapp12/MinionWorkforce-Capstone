import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const minionsApi = createApi({
  reducerPath: 'minionsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://minion-review-site.onrender.com/' }),
  endpoints: (builder) => ({
    getMinions: builder.query({
      query: () => 'minions'
    })
  })
});

export const { useGetMinionsQuery } = minionsApi;