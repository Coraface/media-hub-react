declare module "themoviedb" {
  interface GenreMap {
    [key: number]: string;
  }

  interface TheMovieDbCommon {
    api_key: string;
    base_uri: string;
    images_uri: string;
    timeout: number;
    language: string;
    genreMap: GenreMap;
  }

  interface TheMovieDbMovies {
    getById: (
      params: { id: number; append_to_response?: string },
      success: (data: any) => void,
      error: (err: any) => void
    ) => void;
  }

  interface TheMovieDbTv {
    getById: (
      params: { id: number; append_to_response?: string },
      success: (data: any) => void,
      error: (err: any) => void
    ) => void;
  }

  interface TheMovieDbSearch {
    getMulti: (
      params: { query: string },
      success: (data: any) => void,
      error: (err: any) => void
    ) => void;
  }

  interface TheMovieDb {
    common: TheMovieDbCommon;
    movies: TheMovieDbMovies;
    tv: TheMovieDbTv;
    search: TheMovieDbSearch;
    // Add other properties and methods as needed
  }

  const theMovieDb: TheMovieDb;
  export default theMovieDb;
}
