import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import keycloak from "../../keycloak/keycloak.ts";
import { User } from "../../api/types/user.ts";
import { FriendRequest } from "../../api/types/friendRequest.ts";

const apiBaseUrl: string = "http://localhost:8081";
const getBaseFriendsUrl = (username: string) => {
  return `${apiBaseUrl}/api/users/${username}/friends`;
};
const getFetchFriendRequestsUrl = (username: string) => {
  return `${getBaseFriendsUrl(username)}/requests`;
};

const friendshipApi = createApi({
  tagTypes: ["FriendRequests", "Friends"],
  reducerPath: "friendshipApi",
  baseQuery: fetchBaseQuery({ baseUrl: apiBaseUrl }),
  endpoints: (builder) => ({
    fetchFriendRequests: builder.query<FriendRequest[], string>({
      query: (username: string) => ({
        method: "GET",
        headers: {
          Authorization: "Bearer " + keycloak.token,
          "Content-Type": "application/json",
        },
        url: getFetchFriendRequestsUrl(username),
      }),
      providesTags: (result, error, username) =>
        result ? [{ type: "FriendRequests", id: username }] : [],
    }),
    fetchFriendships: builder.query<User[], string>({
      query: (username: string) => ({
        method: "GET",
        headers: {
          Authorization: "Bearer " + keycloak.token,
          "Content-Type": "application/json",
        },
        url: getBaseFriendsUrl(username),
      }),
      providesTags: (result, error, username) =>
        result ? [{ type: "Friends", id: username }] : [],
    }),
    sendFriendRequest: builder.mutation({
      query: ({
        username,
        friendUsername,
      }: {
        username: string;
        friendUsername: string;
      }) => ({
        method: "POST",
        headers: {
          Authorization: "Bearer " + keycloak.token,
          "Content-Type": "application/json",
        },
        url: `${getBaseFriendsUrl(username)}/${friendUsername}`,
      }),
      invalidatesTags: (result, error, { username }) => [
        { type: "FriendRequests", id: username },
      ],
    }),
    handleFriendRequest: builder.mutation({
      query: ({
        username,
        friendUsername,
        status,
      }: {
        username: string;
        friendUsername: string;
        status: string;
      }) => ({
        method: "PUT",
        params: { status },
        headers: {
          Authorization: "Bearer " + keycloak.token,
          "Content-Type": "application/json",
        },
        url: `${getBaseFriendsUrl(username)}/${friendUsername}`,
      }),
      invalidatesTags: (result, error, { username }) => [
        { type: "FriendRequests", id: username },
        { type: "Friends", id: username },
      ],
    }),
    removeFriendship: builder.mutation({
      query: ({
        username,
        friendUsername,
      }: {
        username: string;
        friendUsername: string;
      }) => ({
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + keycloak.token,
          "Content-Type": "application/json",
        },
        url: `${getBaseFriendsUrl(username)}/${friendUsername}`,
      }),
      invalidatesTags: (result, error, { username }) => [
        { type: "Friends", id: username },
      ],
    }),
  }),
});

export const {
  useFetchFriendRequestsQuery,
  useFetchFriendshipsQuery,
  useSendFriendRequestMutation,
  useHandleFriendRequestMutation,
  useRemoveFriendshipMutation,
} = friendshipApi;
export { friendshipApi };
