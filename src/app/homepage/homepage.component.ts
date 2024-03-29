import { Component } from '@angular/core';
import { Movie, TypeMovieList } from '../movie-page/models/movie.model';
import { MovieListService } from '../movie-page/services/movie-list.service';

@Component({
  selector: 'tp-movies-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent {
  bannerMovie1: Movie = {} as Movie;
  bannerMovie2: Movie = {} as Movie;
  sliderMovies: {
    title: string;
    clickCounter: number;
    order: number;
    movies: Movie[];
  }[] = [];
  lastSlider = {} as {
    title: string;
    clickCounter: number;
    movies: Movie[];
  };
  constructor(movieService: MovieListService) {
    movieService.search('Avatar 2', 1).subscribe((movies) => {
      this.bannerMovie1 = movies.results[1];
    });
    movieService.search('Ant Man', 1).subscribe((movies) => {
      this.bannerMovie2 = movies.results[1];
    });
    movieService
      .getMovies(TypeMovieList.trending, 1, [])
      .subscribe((movies) => {
        this.sliderMovies.push({
          title: 'Trending',
          clickCounter: 0,
          order: 2,
          movies: movies.results.slice(0, 8),
        });
      });
    movieService.getMovies(TypeMovieList.show, 1, []).subscribe((movies) => {
      this.sliderMovies.push({
        title: 'TV Shows',
        clickCounter: 0,
        order: 3,
        movies: movies.results.slice(0, 8),
      });
    });
    movieService.getMovies(TypeMovieList.popular, 1, []).subscribe((movies) => {
      this.sliderMovies.push({
        title: 'Popular Movies',
        clickCounter: 0,
        order: 5,
        movies: movies.results.slice(0, 8),
      });
    });
  }
  next(i: number) {
    const movieList = document.querySelectorAll<HTMLElement>('.movie-list');

    const movieItemsLength = movieList[i].querySelectorAll(
      '.movie-list-item-img'
    ).length;

    this.sliderMovies[i].clickCounter++;
    const ratio = window.innerWidth / 270;
    if (window.innerWidth <= 765) {
      const valueOfX = new WebKitCSSMatrix(movieList[i].style.transform);
      if (
        movieItemsLength -
          (5 + this.sliderMovies[i].clickCounter) +
          (5 - ratio) >=
        0
      ) {
        movieList[i].style.transform = `translateX(${valueOfX.m41 - 290}px)`;
      } else {
        movieList[i].style.transform = 'translateX(0)';
        this.sliderMovies[i].clickCounter = 0;
      }
    } else {
      const valueOfX = new WebKitCSSMatrix(movieList[i].style.transform);
      if (movieItemsLength - (5 + this.sliderMovies[i].clickCounter) >= 0) {
        movieList[i].style.transform = `translateX(${valueOfX.m41 - 290}px)`;
      } else {
        movieList[i].style.transform = 'translateX(0)';
        this.sliderMovies[i].clickCounter = 0;
      }
    }
  }
}
