import { Movie } from 'src/app/movie-page/models/movie.model';

export interface Flux {
  user: Profile;
  rating: number;
  movie: Movie;
  comment: string;
  date_created: string;
}

export interface Profile {
  id_user: string;
  username: string;
  photo: string;
  notification: number;
}
