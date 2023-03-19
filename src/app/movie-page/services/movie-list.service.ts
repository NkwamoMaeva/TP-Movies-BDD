import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Injectable } from '@angular/core';
import { Movie, MovieResult } from '../models/movie.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MovieListService {
  constructor(private http: HttpClient) {}

  getMoviesTrending(page: number): Observable<MovieResult> {
    return this.http.get<MovieResult>(
      'https://api.themoviedb.org/3/trending/movie/week?api_key=4789d4caefcebacc74ede26d39fe8048&page=' +
        page
    );
  }
  getMoviesDay(page: number): Observable<MovieResult> {
    return this.http
      .get<MovieResult>(
        'https://api.themoviedb.org/3/trending/all/week?api_key=4789d4caefcebacc74ede26d39fe8048&page=' +
          page
      )
      .pipe(
        map((response) => {
          response.results.forEach((result: any) => {
            if (result.title == null) {
              result.title = result.name;
              result.release_date = result.first_air_date;
            }
          });
          console.log(response);
          return response;
        })
      );
  }
  getShows(page: number): Observable<MovieResult> {
    return this.http
      .get<any>(
        'https://api.themoviedb.org/3/trending/tv/week?api_key=4789d4caefcebacc74ede26d39fe8048&page=' +
          page
      )
      .pipe(
        map((response) => {
          response.results.forEach((result: any) => {
            result.title = result.name;
            result.release_date = result.first_air_date;
          });
          console.log(response);
          return response;
        })
      );
  }
  search(search: string): Observable<MovieResult> {
    return this.http.get<MovieResult>(
      'https://api.themoviedb.org/3/search/movie?api_key=4789d4caefcebacc74ede26d39fe8048&query=' +
        search
    );
  }
}
