import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Media } from "../../api/types/media";
import keycloak from "../../keycloak/keycloak.ts";

const apiBaseUrl: string = "http://localhost:8081";
let username: string;
console.log("Username", keycloak);
let baseMediaUrl: string;
let addMediaUrl: string;
let removeMediaUrl: string;
const fetchStatusUrl = (mediaType: string, mediaId: number): string => {
  const mediaTypePlural = mediaType === "movie" ? "movies" : "series";
  username = keycloak.tokenParsed?.preferred_username;
  baseMediaUrl = `${apiBaseUrl}/api/users/${username}/media`;
  addMediaUrl = `${baseMediaUrl}?status=`;
  removeMediaUrl = `${baseMediaUrl}?`;
  console.log("Username", keycloak.tokenParsed?.preferred_username);
  return `${baseMediaUrl}/${mediaTypePlural}/${mediaId}`;
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
          url: fetchStatusUrl(mediaType, mediaId),
        };
      },
    }),
    addWantedMedia: builder.mutation({
      query: ({ media, status }: { media: Media; status: string }) =>
        createMediaQuery(media, status),
      transformResponse: (response: string) => response,
    }),
    addFinishedMedia: builder.mutation({
      query: ({ media, status }: { media: Media; status: string }) =>
        createMediaQuery(media, status),
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
    }),
  }),
});

export const {
  useFetchMediaStatusQuery,
  useAddWantedMediaMutation,
  useAddFinishedMediaMutation,
  useRemoveWantedMediaMutation,
  useRemoveFinishedMediaMutation,
} = mediaApi;
export { mediaApi };
