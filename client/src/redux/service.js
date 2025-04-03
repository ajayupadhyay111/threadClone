import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { addMyInfo, addSingle, addToAllPost, addUser } from "./slice";
export const serviceAPI = createApi({
  reducerPath: "serviceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    credentials: "include",
  }),
  keepUnusedDataFor: 60 * 60 * 24 * 7,
  tagTypes: ["Post", "User", "Me"],
  endpoints: (builder) => ({
    signin: builder.mutation({
      query: (data) => ({
        url: "/signin",
        method: "POST",
        body: data,
      }),
      invalidateTag: ["Me"],
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Me"],
    }),
    myInfo: builder.query({
      query: () => ({
        url: "/profile",
        method: "GET",
      }),
      providesTags: ["Me"],
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(addMyInfo(data.data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/user/logout",
        method: "POST",
      }),
    }),
    userDetails: builder.query({
      query: (id) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, { id }) => [{ type: "User", id }],
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(addUser(data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    searchUsers: builder.query({
      query: (query) => ({
        url: `/user/search/${query}`,
        method: "GET",
      }),
    }),
    followUser: builder.mutation({
      query: (id) => ({
        url: `/user/follow/${id}`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/user/updateProfile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Me"],
    }),
    allPost: builder.query({
      query: (page) => ({
        url: `/posts?page=${page}`,
        method: "GET",
      }),
      providesTags: (result, err, args) => {
        return result
          ? [
              ...result.map(({ _id }) => ({ type: "Post", id: _id })),
              { type: "Post", id: "LIST" },
            ]
          : [{ type: "Post", id: "LIST" }];
      },
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(addToAllPost(data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    addPost: builder.mutation({
      query: (data) => ({
        url: "/post/addpost",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Post"],
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(addSingle(data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/deletepost/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(data);
        } catch (error) {
          console.log(error);
        }
      },
    }),
    likePost: builder.mutation({
      query: (id) => ({
        url: `/post/like/${id}`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Post", id }],
    }),
    singlePost: builder.query({
      query: (id) => ({
        url: `/post/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, { id }) => [{ type: "Post", id }],
    }),
    repost: builder.mutation({
      query: (id) => ({
        url: `/repost/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),
    addComment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/addComment/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteComment: builder.mutation({
      query: ({ postId, id }) => ({
        url: `/comment/${postId}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
      ],
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useSigninMutation,
  useLoginMutation,
  useMyInfoQuery,
  useLogoutMutation,
  useAllPostQuery,
  useUserDetailsQuery,
  useSearchUsersQuery,
  useFollowUserMutation,
  useAddPostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useSinglePostQuery,
  useRepostMutation,
  useAddCommentMutation,
  useDeleteCommentMutation
} = serviceAPI;
