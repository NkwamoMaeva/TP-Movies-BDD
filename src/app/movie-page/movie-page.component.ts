import { Component } from '@angular/core';
import { MovieResult } from './models/movie.model';
import { PageEvent } from '@angular/material/paginator';
import { MovieListService } from './services/movie-list.service';

@Component({
  selector: 'tp-movies-movie-page',
  templateUrl: './movie-page.component.html',
  styleUrls: ['./movie-page.component.scss'],
})
export class MoviePageComponent {
  movies: MovieResult = {} as MovieResult;
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
  pageIndex = 0;
  loading = true;

  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex + 1;
    this.loading = false;
    this.movieListService
      .getMoviesTrending(this.pageIndex)
      .subscribe((movies) => {
        this.movies = movies;
        this.loading = false;
        // this.applyFilter(this.selectedGenre);
      });
  }

  constructor(private movieListService: MovieListService) {
    this.movieListService.getMoviesTrending(1).subscribe((movies) => {
      this.movies = movies;
      this.loading = false;
      // this.applyFilter(this.selectedGenre);
    });
  }
}
