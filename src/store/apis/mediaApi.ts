import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Media } from "../../api/types/media";
import keycloak from "../../keycloak/keycloak.ts";

const apiBaseUrl: string = "http://localhost:8081";
let username: string;
console.log("Username", keycloak);
let baseMediaUrl: string;
let fetchMediaUrl: string;
let addMediaUrl: string;
let removeMediaUrl: string;
const fetchUrl = (mediaType: string, mediaId?: number): string => {
  const mediaTypePlural = mediaType === "movie" ? "movies" : "series";
  username = keycloak.tokenParsed?.preferred_username;
  baseMediaUrl = `${apiBaseUrl}/api/users/${username}/media`;
  fetchMediaUrl = `${baseMediaUrl}/${mediaType}?status=`;
  addMediaUrl = `${baseMediaUrl}?status=`;
  removeMediaUrl = `${baseMediaUrl}?`;
  console.log("Username", keycloak.tokenParsed?.preferred_username);
  return mediaId
    ? `${baseMediaUrl}/${mediaTypePlural}/${mediaId}`
    : fetchMediaUrl;
};

const createMediaQuery = (media: Media, status: string) => ({
  method: "POST",
  headers: {
    Authorization: "Bearer " + keycloak.token,
    "Content-Type": "application/json",
  },
  url: addMediaUrl + status,
  body: media,
});

const createRemoveMediaQuery = (
  id: number,
  mediaType: string,
  status: string
) => ({
  method: "DELETE",
  headers: {
    Authorization: "Bearer " + keycloak.token,
    "Content-Type": "application/json",
  },
  url: removeMediaUrl + `id=${id}&mediaType=${mediaType}&status=${status}`,
});

const mediaApi = createApi({
  tagTypes: ["MediaStatus"],
  reducerPath: "media",
  baseQuery: fetchBaseQuery({ baseUrl: apiBaseUrl }),
  endpoints: (builder) => ({
    fetchMediaStatus: builder.query({
      query: ({
        mediaType,
        mediaId,
      }: {
        mediaType: string;
        mediaId: number;
      }) => {
        return {
          method: "GET",
          headers: {
            Authorization: "Bearer " + keycloak.token,
            "Content-Type": "application/json",
          },
          url: fetchUrl(mediaType, mediaId),
        };
      },
      providesTags: (result, error, { mediaId }) =>
        result ? [{ type: "MediaStatus", id: mediaId }] : [],
    }),
    fetchWantedMedia: builder.query({
      query: (mediaType: string) => {
        return {
          method: "GET",
          headers: {
            Authorization: "Bearer " + keycloak.token,
            "Content-Type": "application/json",
          },
          url: fetchUrl(mediaType) + "wanted",
        };
      },
    }),
    fetchFinishedMedia: builder.query({
      query: (mediaType: string) => {
        return {
          method: "GET",
          headers: {
            Authorization: "Bearer " + keycloak.token,
            "Content-Type": "application/json",
          },
          url: fetchUrl(mediaType) + "finished",
        };
      },
    }),
    addWantedMedia: builder.mutation({
      query: ({ media, status }: { media: Media; status: string }) =>
        createMediaQuery(media, status),
      invalidatesTags: (result, error, { media }) => [
        { type: "MediaStatus" as const, id: media.id },
      ],
    }),
    addFinishedMedia: builder.mutation({
      query: ({ media, status }: { media: Media; status: string }) =>
        createMediaQuery(media, status),
      invalidatesTags: (result, error, { media }) => [
        { type: "MediaStatus" as const, id: media.id },
      ],
    }),
    removeWantedMedia: builder.mutation({
      query: ({
        id,
        mediaType,
        status,
      }: {
        id: number;
        mediaType: string;
        status: string;
      }) => createRemoveMediaQuery(id, mediaType, status),
      transformResponse: (response: string) => response,
      invalidatesTags: (result, error, { id }) => [
        { type: "MediaStatus" as const, id },
      ],
    }),
    removeFinishedMedia: builder.mutation({
      query: ({
        id,
        mediaType,
        status,
      }: {
        id: number;
        mediaType: string;
        status: string;
      }) => createRemoveMediaQuery(id, mediaType, status),
      invalidatesTags: (result, error, { id }) => [
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
