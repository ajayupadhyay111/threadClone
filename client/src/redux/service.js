import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  addMyInfo,
  addSingle,
  addToAllPost,
  addUser,
  deletePost,
} from "./slice";
export const serviceAPI = createApi({
  reducerPath: "serviceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://threadclone-sn8i.onrender.com/api",
    credentials: "include", // 👈 send cookie with request
    headers: {
      "Content-Type": "application/json",
    },
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
          console.log(error.error.data?.message);
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
    searchUsers: builder.mutation({
      query: (query) => ({
        url: `/user/search`,
        method: "POST",
        body: query,
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
      invalidatesTags: ["Me","User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Update user info in Redux store if needed
          if (data.success) {
            console.log(data)
            dispatch(addMyInfo(data));
          }
        } catch (error) {
          console.error('Profile update error:', error);
        }
      },
    }),
    allPost: builder.query({
      query: (page) => ({
        url: `/posts?page=${page}`,
        method: "GET",
      }),
      providesTags: (result, err, args) => {
        return result
          ? [
              ...result.posts.map(({ _id }) => ({ type: "Post", id: _id })),
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
      query: (data) => (
        console.log(data),
        {
        url: "/post/addpost",
        method: "POST",
        body: data, // this should be a FormData object
        // ❌ DO NOT add headers manually
      }),
      invalidatesTags: ["Post"],
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled; // this will throw if response is 400
          dispatch(addSingle(data));
        } catch (error) {
          console.log("Error in addPost mutation:", error);
        }
      },
    }),
    
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/deletepost/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(deletePost(data));
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
      invalidatesTags: (result, error, id) => [
        { type: "Post", id },
        { type: "User" }, // Add this to invalidate user details
      ],
    }),
    singlePost: builder.query({
      query: (id) => ({
        url: `/post/${id}`,
        method: "GET",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Post", id }],
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
      invalidatesTags: (result, error, { id }) => [
        { type: "Post", id },
        "User",
      ],
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
  useSearchUsersMutation,
  useFollowUserMutation,
  useAddPostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useSinglePostQuery,
  useRepostMutation,
  useAddCommentMutation,
  useDeleteCommentMutation,
} = serviceAPI;
