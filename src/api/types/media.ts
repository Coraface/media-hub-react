export interface Media {
  backdrop_path: string;
  id: number;
  title: string;
  media_type: string;
  release_date: string;
  overview: string;
  poster_path: string;
  genres: string;
  vote_average: number;
  director: string;
  runtime?: number;
  number_of_episodes?: number;
  number_of_seasons?: number;
}

export interface SearchMediaResponse {
  id: number;
  title: string;
  media_type: string;
  release_date: string;
  overview: string;
  poster_path: string;
  genres: string;
  vote_average: number;
}
