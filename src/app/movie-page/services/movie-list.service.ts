import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Injectable } from '@angular/core';
import { TypeMovieList, MoviesResponse, Movie } from '../models/movie.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MovieListService {
  constructor(private http: HttpClient) {}

  public getMovies(
    type: string,
    page: number,
    genres?: number[],
    search?: string
  ): Observable<MoviesResponse> {
    const apiLink = 'https://api.themoviedb.org/3/';
    const apiKey = '4789d4caefcebacc74ede26d39fe8048';

    if (search && search !== '') {
      return this.search(search, page);
    } else if (type === TypeMovieList.popular) {
      return this.http
        .get<MoviesResponse>(
          apiLink + 'movie/popular?api_key=' + apiKey + '&page=' + page
        )
        .pipe(
          map((response) => {
            response.results.forEach((result: any) => {
              if (result.title == null) {
                result.title = result.name;
                result.release_date = result.first_air_date;
              }
            });
            return response;
          })
        );
    } else if (type === TypeMovieList.trending) {
      const filterGenre = genres?.join('|') ?? [];

      return this.http.get<MoviesResponse>(
        apiLink +
          'trending/movie/week?api_key=' +
          apiKey +
          '&page=' +
          page +
          '&with_genres=' +
          filterGenre
      );
    } else if (type === TypeMovieList.show) {
      return this.http
        .get<MoviesResponse>(
          apiLink + 'trending/tv/week?api_key=' + apiKey + '&page=' + page
        )
        .pipe(
          map((response) => {
            response.results.forEach((result: any) => {
              result.title = result.name;
              result.release_date = result.first_air_date;
            });
            return response;
          })
        );
    } else {
      const filterGenre = genres?.join('|') ?? [];

      return this.http.get<MoviesResponse>(
        apiLink +
          'discover/movie?api_key=' +
          apiKey +
          '&page=' +
          page +
          '&with_genres=' +
          filterGenre
      );
    }
  }
  public search(search: string, page: number): Observable<MoviesResponse> {
    return this.http.get<MoviesResponse>(
      'https://api.themoviedb.org/3/search/movie?api_key=4789d4caefcebacc74ede26d39fe8048&query=' +
        search +
        '&page=' +
        page
    );
  }

  public getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(
      'https://api.themoviedb.org/3/movie/' +
        id +
        '?api_key=4789d4caefcebacc74ede26d39fe8048&append_to_response=credits'
    );
  }
}
