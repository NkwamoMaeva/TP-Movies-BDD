export interface Flux {
  id_user: string;
  rating: number,
  movie_name: string,
  date_created: string,
}

export interface FluxResult {
  page: number;
  results: Flux[];
}
