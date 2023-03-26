import { inject, Injectable } from '@angular/core';
import { map, Observable, filter, first } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Genre, GenresResponse } from '../models/genre.model';

@Injectable({ providedIn: 'root' })
export class GenresService {
  private readonly http = inject(HttpClient);

  public getGenres(): Observable<Genre[]> {
    return this.http
      .get<GenresResponse>(
        'https://api.themoviedb.org/3/genre/movie/list?api_key=75943a3951570438452121a3db0fda8a'
      )
      .pipe(map((response: GenresResponse) => response.genres));
  }

  public getGenresById(id: number): Observable<any> {
    return this.getGenres().pipe(
      map((items: Genre[]) => items.filter((item: Genre) => item.id === id)),
      map((array) => array[0]),
      map((response: Genre) => response.name)
    );
  }
}
