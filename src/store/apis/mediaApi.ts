import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import theMovieDb from "../../scripts/themoviedb";
import { Media } from "../../api/types/media";

const baseUrl: string = theMovieDb.common.base_uri;

export interface SearchResponse {
  page: number;
  results: {
    backdrop_path: string;
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    media_type: string;
    genre_ids: number[];
    vote_average: number;
  }[];
}

const fetchFromTMDB = async (title: string): Promise<SearchResponse> => {
  return new Promise((resolve, reject) => {
    theMovieDb.search.getMulti(
      { query: title },
      (data: string) => {
        console.log("Success callback: ", data);
        resolve(JSON.parse(data) as SearchResponse);
      },
      (error: Error) => {
        console.log("Error callback: " + error);
        reject(error);
      }
    );
  });
};

const mediaApi = createApi({
  reducerPath: "media",
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (builder) => ({
    fetchMedia: builder.query({
      queryFn: async (title) => {
        const data = await fetchFromTMDB(title);
        console.log("Data: ", data.results);
        const mappedResults: Media[] = data.results.map(
          ({
            backdrop_path,
            id,
            title,
            overview,
            poster_path,
            media_type,
            genre_ids,
            vote_average,
          }) => {
            return {
              backdrop_path,
              id,
              title,
              overview,
              poster_path,
              media_type,
              genre_ids,
              vote_average,
            };
          }
        );
        return { data: mappedResults };
      },
    }),
  }),
});

export const { useFetchMediaQuery } = mediaApi;
export { mediaApi };
