export interface Media {
  backdrop_path: string;
  id: number;
  title: string;
  media_type: string;
  year: string;
  overview: string;
  imageUri: string;
  genre: string;
  rating: number;
  director: string;
  durationMinutes?: number;
  episodes?: number;
  seasons?: number;
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
