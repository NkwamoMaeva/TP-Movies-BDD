import { Component, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { DialogFluxDetailComponent } from 'src/app/flux/flux-list.component';
import { Flux } from 'src/app/flux/models/flux.model';
import { FluxListService } from 'src/app/flux/services/flux-list.service';
import { Movie } from '../models/movie.model';
import { MovieListService } from '../services/movie-list.service';

@Component({
  selector: 'tp-movies-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss'],
})
export class MovieDetailComponent {
  private readonly movieListService = inject(MovieListService);
  public readonly fluxService = inject(FluxListService);
  flux$: Flux[] = [];
  userId = '';

  movie: any = {};
  casts: any[] = [];

  constructor(
    route: ActivatedRoute,
    private auth: AngularFireAuth,
    public dialog: MatDialog
  ) {
    console.log(route.snapshot.params['id']);
    this.movieListService
      .getMovieById(route.snapshot.params['id'])
      .subscribe((result) => {
        console.log(result);
        this.movie = result;
        this.casts = this.movie.credits.cast.slice(0, 10);

        this.fluxService
          .getFluxByMovieId(this.movie.id)
          .subscribe((rating: Flux[]) => {
            this.flux$ = rating;
          });
      });

    this.auth.user.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
      } else {
        console.log('No user is currently signed in.');
      }
    });
  }

  openDialog(flux: Flux) {
    this.dialog.open(DialogFluxDetailComponent, {
      data: flux,
    });
  }

  convertDuration(runtime: number): number[] {
    const hours = Math.trunc(runtime / 60);
    const minutes = runtime - hours * 60;

    return [hours, minutes];
  }

  convertDate(date: string) {
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    } as const;
    const result = new Date(date);
    return result.toLocaleDateString('en-US', options);
  }
}
