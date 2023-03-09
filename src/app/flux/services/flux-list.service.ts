import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Injectable } from '@angular/core';
import { FluxResult } from '../models/flux.model';

@Injectable({
  providedIn: 'root',
})
export class FluxListService {
  constructor(private http: HttpClient) {}

  getMovies(): Observable<FluxResult> {
    return this.http.get<FluxResult>(
      'https://api.themoviedb.org/3/movie/937278/reviews?api_key=4789d4caefcebacc74ede26d39fe8048'
    );
  }
}
