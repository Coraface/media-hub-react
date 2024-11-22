export interface Media {
  backdrop_path?: string;
  id: number;
  title: string;
  media_type: string;
  popularity: number;
  year: string;
  overview: string;
  imageUri: string | undefined;
  genre: string;
  rating: number;
  director?: string;
  durationMinutes?: number;
  episodes?: number;
  seasons?: number;
}

export interface SearchMediaResponse {
  id: number;
  title: string;
  media_type: string;
  popularity: number;
  release_date: string;
  overview: string;
  poster_path?: string;
  genres: string;
  vote_average: number;
}
