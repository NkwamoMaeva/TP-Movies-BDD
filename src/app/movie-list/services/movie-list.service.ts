import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Injectable } from '@angular/core';
import { MovieResult } from '../models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class MovieListService {
  constructor(private http: HttpClient) {}

  getMovies(): Observable<MovieResult> {
    return this.http.get<MovieResult>(
      'https://api.themoviedb.org/3/trending/movie/week?api_key=4789d4caefcebacc74ede26d39fe8048'
    );
  }
}
