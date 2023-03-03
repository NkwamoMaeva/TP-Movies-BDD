import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Joke {
  setup: string;

  delivery: string;
}

export interface Result {
  id: number;
  title: string;
  overview : string;
  popularity : number;
  poster_path : string;
}

export interface Results {
  results: Array<Result>;
}

@Injectable({ providedIn: 'root' })
export class AppService {
  private readonly apiKey = '4789d4caefcebacc74ede26d39fe8048';
  private readonly apiUrl = 'https://api.themoviedb.org/3/movie/popular';

  constructor(private httpClient: HttpClient) {}

  public getJoke(): Observable<Joke> {
    return this.httpClient.get<Joke>(
      'https://v2.jokeapi.dev/joke/Programming?type=twopart&safe-mode'
    );
  }

  public getPopularMovies(): Observable<Results> {
    return this.httpClient.get<Results>(`${this.apiUrl}?api_key=${this.apiKey}&language=en-US&page=1`);
  }
}
