import {Component, inject} from '@angular/core';
import {FluxListService} from "./services/flux-list.service";
import {MovieListService} from "../movie-list/services/movie-list.service";
import {Movie} from "../movie-list/models/movie.model";

@Component({
  selector: 'tp-movies-movie-list',
  templateUrl: './flux-list.component.html',
  styleUrls: ['./flux-list.component.scss'],
})
export class FluxListComponent {
  public readonly flux = inject(FluxListService).flux
  public readonly profiles = inject(FluxListService).profiles;

  movies: Movie[] = [];
  constructor(private fluxService : FluxListService, private movieListService: MovieListService) {
    this.fluxService.changeNotif();
    this.movieListService.getMovies().subscribe((movies) => {
      this.movies = movies.results;
      // this.applyFilter(this.selectedGenre);
    });
  }


}