import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import keycloak from "../../keycloak/keycloak.ts";
import { User } from "../../api/types/user.ts";
import { FriendRequest } from "../../api/types/friendRequest.ts";

const apiBaseUrl: string = "";
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
    fetchFriendRequests: builder.query<
      FriendRequest[],
      { username: string; type: string }
    >({
      query: ({ username, type }) => ({
        method: "GET",
        headers: {
          Authorization: "Bearer " + keycloak.token,
          "Content-Type": "application/json",
        },
        params: { type },
        url: getFetchFriendRequestsUrl(username),
      }),
      providesTags: (result, _error, { username }) =>
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
      providesTags: (result, _error, username) =>
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
      invalidatesTags: (_result, _error, { username, friendUsername }) => [
        { type: "FriendRequests", id: username },
        { type: "FriendRequests", id: friendUsername },
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
      invalidatesTags: (_result, _error, { username }) => [
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
      invalidatesTags: (_result, _error, { username, friendUsername }) => [
        { type: "Friends", id: friendUsername },
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
