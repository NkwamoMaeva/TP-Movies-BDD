import {Component, inject} from '@angular/core';
import {FluxListService} from "./services/flux-list.service";
import {Movie} from "../movie-page/models/movie.model";
import {MovieListService} from "../movie-page/services/movie-list.service";

@Component({
  selector: 'tp-movies-movie-list',
  templateUrl: './flux-list.component.html',
  styleUrls: ['./flux-list.component.scss'],
})
export class FluxListComponent {
  public readonly flux = inject(FluxListService).flux
  public readonly profiles = inject(FluxListService).profiles;

  movies: Movie[] = [];
  constructor(private fluxService : FluxListService, private movieListService: MovieListService, private readonly rts: FluxListService) {
    this.fluxService.changeNotif();
    this.movieListService.getMoviesTrending(1).subscribe((movies) => {
      this.movies = movies.results;
      // this.applyFilter(this.selectedGenre);
    });
  }

  addNote(id_user: string, id: number) {
    this.rts.addNote(id_user, id).then(() => {
      console.log('Document added');
    });
  }
}