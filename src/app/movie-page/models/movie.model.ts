export interface Movie {
  title: string;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

export interface MovieResult {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}
