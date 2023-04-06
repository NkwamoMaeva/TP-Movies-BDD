export interface Movie {
  id: number;
  title: string;
  genre_ids: number[];
  runtime: number;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export enum TypeMovieList {
  trending = 'trending',
  show = 'show',
  popular = 'popular',
  all = 'all',
}
