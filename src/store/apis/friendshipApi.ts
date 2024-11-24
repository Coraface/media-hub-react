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
