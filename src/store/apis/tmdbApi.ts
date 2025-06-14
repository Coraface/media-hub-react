import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import theMovieDb from "themoviedb";
import { Media } from "../../api/types/media";

const baseUrl: string = theMovieDb.common.base_uri;

export interface SearchResponse {
  page: number;
  results: MediaDetailsResponse[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface Credits {
  crew: {
    job: string;
    name: string;
  }[];
}

export interface MediaDetailsResponse {
  backdrop_path: string;
  id: number;
  title: string;
  name: string;
  media_type: string;
  popularity: number;
  release_date: string;
  first_air_date: string;
  overview: string;
  poster_path: string;
  genre_ids: number[];
  genres?: Genre[];
  vote_average: number;
  credits: Credits;
  created_by?: {
    name: string;
  }[];
  runtime: number | null;
  number_of_episodes: number | null;
  number_of_seasons: number | null;
}

const searchFromTMDB = async (title: string): Promise<SearchResponse> => {
  return new Promise((resolve, reject) => {
    theMovieDb.search.getMulti(
      { query: title },
      handleSuccess(resolve),
      handleError(reject)
    );
  });
};

const fetchFromTMDB = async (
  id: number,
  mediaType: string
): Promise<MediaDetailsResponse> => {
  mediaType = mediaType === "tv" ? "series" : "movies";
  if (mediaType === "movies") {
    return new Promise((resolve, reject) => {
      theMovieDb.movies.getById(
        { id: id, append_to_response: "credits" },
        handleSuccess(resolve),
        handleError(reject)
      );
    });
  } else {
    return new Promise((resolve, reject) => {
      theMovieDb.tv.getById(
        { id: id, append_to_response: "credits" },
        handleSuccess(resolve),
        handleError(reject)
      );
    });
  }
};

const handleSuccess =
  <T>(resolve: (value: T) => void) =>
  (data: string) => {
    console.log("Success callback: ", data);
    resolve(JSON.parse(data) as T);
  };

const handleError = (reject: (reason?: unknown) => void) => (error: Error) => {
  console.log("Error callback: " + error);
  reject(error);
};

const tmdbApi = createApi({
  reducerPath: "tmdb",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    searchMedia: builder.query({
      queryFn: async (title) => {
        const data = await searchFromTMDB(title);
        console.log("Data: ", data.results);
        const mappedResults: Media[] = data.results.map((data) => {
          return {
            id: data.id,
            title: data.title || data.name,
            media_type: data.media_type,
            popularity: data.popularity,
            year: data.release_date
              ? data.release_date.split("-")[0]
              : data.first_air_date?.split("-")[0],
            overview: data.overview,
            imageUri: data.poster_path
              ? `${theMovieDb.common.images_uri}w500${data.poster_path}`
              : undefined,
            genre: (data.genre_ids ?? [])
              .map((id: number) => theMovieDb.common.genreMap[id] || "Unknown")
              .join(", "),
            rating: data.vote_average,
          };
        });
        return { data: mappedResults };
      },
    }),
    fetchMediaDetails: builder.query({
      queryFn: async ({ id, mediaType }) => {
        const data = await fetchFromTMDB(id, mediaType);
        console.log("Data: ", data);
        console.log(data.created_by?.map((creator) => creator.name).join(", "));
        const result: Media = {
          backdrop_path: `${theMovieDb.common.images_uri}original${data.backdrop_path}`,
          id: data.id,
          title: data.title || data.name || "Unknown Title",
          media_type: data.title ? "movie" : "tv",
          popularity: data.popularity,
          year: data.release_date
            ? data.release_date.split("-")[0]
            : data.first_air_date
            ? data.first_air_date.split("-")[0]
            : "Unknown",
          overview: data.overview,
          imageUri: `${theMovieDb.common.images_uri}w500${data.poster_path}`,
          genre: (data.genres as Genre[])
            .map((genre: Genre) => genre.name)
            .join(", "),
          rating: data.vote_average,
          director:
            data.created_by?.map((creator) => creator.name).join(", ") ||
            data.credits.crew.find((crew) => crew.job === "Director")?.name ||
            "Unknown",
          durationMinutes: data.runtime || undefined,
          episodes: data.number_of_episodes || undefined,
          seasons: data.number_of_seasons || undefined,
        };
        return { data: result };
      },
    }),
  }),
});

export const { useSearchMediaQuery, useFetchMediaDetailsQuery } = tmdbApi;
export { tmdbApi };
