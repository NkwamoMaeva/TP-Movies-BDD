import { Component, Input } from '@angular/core';
import { Movie } from '../models/movie.model';

@Component({
  selector: 'tp-movies-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
})
export class MovieListComponent {
  @Input() movies: Movie[] | undefined = [];
}
