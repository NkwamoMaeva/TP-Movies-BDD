import { Movie } from 'src/app/movie-page/models/movie.model';

export interface Flux {
  user: Profile;
  rating: number;
  movie: Movie;
  comment: string;
  date_created: string;
  id_user :  string;
}

export interface Rating {
  id_user: string;
  rating: number;
  id_movie: number;
  date_created: string;
  comment: string;
}


export interface Profile {
  id_user: string;
  username: string;
  photo: string;
  notification: number;
}

export enum TypeFluxList {
  ALL = 'all',
  MINES = 'mines',
}
