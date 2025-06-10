import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Media } from "../../api/types/media";
import keycloak from "../../keycloak/keycloak.ts";

const apiBaseUrl: string = "";
const getBaseMediaUrl = (username: string) =>
  `${apiBaseUrl}/api/users/${username}/media`;

const getFetchStatusUrl = (
  username: string,
  mediaType: string,
  mediaId: number
) => {
  const baseMediaUrl = getBaseMediaUrl(username);
  return `${baseMediaUrl}/${mediaType}/${mediaId}`;
};

const getFetchMediaUrl = (username: string, mediaType: string) => {
  const baseMediaUrl = getBaseMediaUrl(username);
  return `${baseMediaUrl}/${mediaType}?status=`;
};

const getAddMediaUrl = (username: string, status: string) => {
  const baseMediaUrl = getBaseMediaUrl(username);
  return `${baseMediaUrl}?status=${status}`;
};

const getRemoveMediaUrl = (
  username: string,
  mediaType: string,
  mediaId: number,
  status: string
) => {
  const baseMediaUrl = getBaseMediaUrl(username);
  return `${baseMediaUrl}?id=${mediaId}&mediaType=${mediaType}&status=${status}`;
};

const mediaApi = createApi({
  tagTypes: ["MediaStatus"],
  reducerPath: "media",
  baseQuery: fetchBaseQuery({ baseUrl: apiBaseUrl }),
  endpoints: (builder) => ({
    fetchMediaStatus: builder.query({
      query: ({
        username,
        mediaType,
        mediaId,
      }: {
        username: string;
        mediaType: string;
        mediaId: number;
      }) => {
        return {
          method: "GET",
          headers: {
            Authorization: "Bearer " + keycloak.token,
            "Content-Type": "application/json",
          },
          url: getFetchStatusUrl(username, mediaType, mediaId),
        };
      },
      providesTags: (result, _error, { mediaId }) =>
        result ? [{ type: "MediaStatus", id: mediaId }] : [],
    }),
    fetchWantedMedia: builder.query({
      query: ({
        username,
        mediaType,
      }: {
        username: string;
        mediaType: string;
      }) => {
        return {
          method: "GET",
          headers: {
            Authorization: "Bearer " + keycloak.token,
            "Content-Type": "application/json",
          },
          url: getFetchMediaUrl(username, mediaType) + "wanted",
        };
      },
    }),
    fetchFinishedMedia: builder.query({
      query: ({
        username,
        mediaType,
      }: {
        username: string;
        mediaType: string;
      }) => {
        return {
          method: "GET",
          headers: {
            Authorization: "Bearer " + keycloak.token,
            "Content-Type": "application/json",
          },
          url: getFetchMediaUrl(username, mediaType) + "finished",
        };
      },
    }),
    addWantedMedia: builder.mutation({
      query: ({
        username,
        media,
        status,
      }: {
        username: string;
        media: Media;
        status: string;
      }) => ({
        method: "POST",
        headers: {
          Authorization: "Bearer " + keycloak.token,
          "Content-Type": "application/json",
        },
        url: getAddMediaUrl(username, status),
        body: media,
      }),
      invalidatesTags: (_result, _error, { media }) => [
        { type: "MediaStatus" as const, id: media.id },
      ],
    }),
    addFinishedMedia: builder.mutation({
      query: ({
        username,
        media,
        status,
      }: {
        username: string;
        media: Media;
        status: string;
      }) => ({
        method: "POST",
        headers: {
          Authorization: "Bearer " + keycloak.token,
          "Content-Type": "application/json",
        },
        url: getAddMediaUrl(username, status),
        body: media,
      }),
      invalidatesTags: (_result, _error, { media }) => [
        { type: "MediaStatus" as const, id: media.id },
      ],
    }),
    removeWantedMedia: builder.mutation({
      query: ({
        username,
        mediaType,
        id,
        status,
      }: {
        username: string;
        mediaType: string;
        id: number;
        status: string;
      }) => ({
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + keycloak.token,
          "Content-Type": "application/json",
        },
        url: getRemoveMediaUrl(username, mediaType, id, status),
      }),
      transformResponse: (response: string) => response,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "MediaStatus" as const, id },
      ],
    }),
    removeFinishedMedia: builder.mutation({
      query: ({
        username,
        mediaType,
        id,
        status,
      }: {
        username: string;
        mediaType: string;
        id: number;
        status: string;
      }) => ({
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + keycloak.token,
          "Content-Type": "application/json",
        },
        url: getRemoveMediaUrl(username, mediaType, id, status),
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "MediaStatus" as const, id },
      ],
    }),
  }),
});

export const {
  useFetchMediaStatusQuery,
  useFetchWantedMediaQuery,
  useFetchFinishedMediaQuery,
  useAddWantedMediaMutation,
  useAddFinishedMediaMutation,
  useRemoveWantedMediaMutation,
  useRemoveFinishedMediaMutation,
} = mediaApi;
export { mediaApi };
