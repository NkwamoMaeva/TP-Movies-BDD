import { Component } from '@angular/core';
import { Movie } from './models/movie.model';
import { MovieListService } from './services/movie-list.service';

@Component({
  selector: 'tp-movies-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
})
export class MovieListComponent {
  movies: Movie[] = [];
  genres = [
    { name: 'Comedy', selected: false },
    { name: 'Drama', selected: false },
    { name: 'Action', selected: false },
    { name: 'Thriller', selected: false },
    { name: 'Horror', selected: false },
    { name: 'Romance', selected: false },
    { name: 'Family', selected: false },
  ];
  selectedGenres = [];
  query = '';

  constructor(private movieListService: MovieListService) {
    this.movieListService.getMovies().subscribe((movies) => {
      this.movies = movies.results;
      // this.applyFilter(this.selectedGenre);
    });
  }
}
