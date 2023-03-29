import { Component, Inject, inject } from '@angular/core';
import { FluxListService } from './services/flux-list.service';
import { Movie } from '../movie-page/models/movie.model';
import { MovieListService } from '../movie-page/services/movie-list.service';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Flux } from './models/flux.model';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'tp-movies-movie-flux',
  templateUrl: './flux-list.component.html',
  styleUrls: ['./flux-list.component.scss'],
})
export class FluxListComponent {
  public readonly fluxService = inject(FluxListService);
  public readonly profiles = inject(FluxListService).profiles;
  flux$: Observable<Flux[]> = this.fluxService.getFlux();
  movies: Movie[] = [];
  userId = '';
  newNoteValue = '';
  private ratingsCollection: AngularFirestoreCollection<any>;

  constructor(
    private movieListService: MovieListService,
    private auth: AngularFireAuth,
    private afs: AngularFirestore,
    public dialog: MatDialog
  ) {
    this.fluxService.changeNotif();
    this.movieListService.getMovies('all', 1).subscribe((movies) => {
      this.movies = movies.results;
      // this.applyFilter(this.selectedGenre);
    });
    this.auth.user.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
      } else {
        console.log('No user is currently signed in.');
      }
    });
    this.ratingsCollection = afs.collection<any>('Ratings');
  }

  openDialog(flux: Flux) {
    this.dialog.open(DialogFluxDetailComponent, {
      data: flux,
    });
  }
}

@Component({
  selector: 'tp-movies-dialog-flux-detail',
  templateUrl: 'dialog-flux-detail.html',
  styleUrls: ['./dialog-flux-detail.scss'],
})
export class DialogFluxDetailComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Flux) {}
}
