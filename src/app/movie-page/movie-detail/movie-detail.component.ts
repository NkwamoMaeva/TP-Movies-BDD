import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Movie } from '../models/movie.model';
import { MovieListService } from '../services/movie-list.service';

@Component({
  selector: 'tp-movies-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss'],
})
export class MovieDetailComponent {
  private readonly movieListService = inject(MovieListService);
  movie: any = {};

  constructor(route: ActivatedRoute) {
    console.log(route.snapshot.params['id']);
    this.movieListService
      .getMovieById(route.snapshot.params['id'])
      .subscribe((result) => {
        this.movie = result
      });
  }
}
