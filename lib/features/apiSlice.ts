// lib/features/apiSlice.ts — RTK Query wired to real Next.js API routes
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Product, Order, ProductStatus, OrderStatus, User } from '../types';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Products', 'Orders', 'Users'],
  endpoints: (builder) => ({

    // ── Products ─────────────────────────────────────────────────────────────

    getProducts: builder.query<Product[], { status?: ProductStatus; sellerId?: string; category?: string }>({
      query: ({ status, sellerId, category } = {}) => {
        const params = new URLSearchParams();
        if (status)   params.set('status', status);
        if (sellerId) params.set('sellerId', sellerId);
        if (category) params.set('category', category);
        return `/products?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Products' as const, id })), { type: 'Products', id: 'LIST' }]
          : [{ type: 'Products', id: 'LIST' }],
    }),

    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Products', id }],
    }),

    addProduct: builder.mutation<Product, Omit<Product, 'id' | 'status' | 'createdAt'>>({
      query: (body) => ({ url: '/products', method: 'POST', body }),
      invalidatesTags: [{ type: 'Products', id: 'LIST' }],
    }),

    updateProductStatus: builder.mutation<Product, { id: string; status: ProductStatus; rejectionReason?: string }>({
      query: ({ id, status, rejectionReason }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body: { status, rejectionReason },
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Products', id }, { type: 'Products', id: 'LIST' }],
    }),

    deleteProduct: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Products', id: 'LIST' }],
    }),

    // ── Orders ───────────────────────────────────────────────────────────────

    getOrders: builder.query<Order[], { buyerId?: string; sellerId?: string }>({
      query: ({ buyerId, sellerId } = {}) => {
        const params = new URLSearchParams();
        if (buyerId)  params.set('buyerId', buyerId);
        if (sellerId) params.set('sellerId', sellerId);
        return `/orders?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Orders' as const, id })), { type: 'Orders', id: 'LIST' }]
          : [{ type: 'Orders', id: 'LIST' }],
    }),

    createOrder: builder.mutation<Order, Omit<Order, 'id' | 'createdAt' | 'status'>>({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      invalidatesTags: [{ type: 'Orders', id: 'LIST' }],
    }),

    updateOrderStatus: builder.mutation<Order, { id: string; status: OrderStatus }>({
      query: ({ id, status }) => ({ url: `/orders/${id}`, method: 'PATCH', body: { status } }),
      invalidatesTags: (_r, _e, { id }) => [{ type: 'Orders', id }, { type: 'Orders', id: 'LIST' }],
    }),

    // ── Users ────────────────────────────────────────────────────────────────

    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: [{ type: 'Users', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductStatusMutation,
  useDeleteProductMutation,
  useGetOrdersQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useGetUsersQuery,
} = apiSlice;
