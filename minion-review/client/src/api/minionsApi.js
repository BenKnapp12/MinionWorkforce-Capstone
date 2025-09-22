import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const minionsApi = createApi({
  reducerPath: 'minionsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/' }),
  endpoints: (builder) => ({
    getMinions: builder.query({
      query: () => 'minions'
    })
  })
});

export const { useGetMinionsQuery } = minionsApi;
