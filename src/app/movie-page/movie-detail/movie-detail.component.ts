import { Component, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
  edit = false;

  constructor(
    route: ActivatedRoute,
    private auth: AngularFireAuth,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogFluxDetailComponent>
  ) {
    this.movieListService
      .getMovieById(route.snapshot.params['id'])
      .subscribe((result) => {
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

  openDialog(element: any, edit: boolean) {
    let result = { movie: {}, comment: '', rating: 0 };

    if (element.user && this.userId == element.user.id_user) {
      edit = true;
    }
    if (element.movie) {
      result = element;
    } else {
      result.movie = element as Movie;
    }
    const dialogRef = this.dialog.open(DialogFluxDetailComponent, {
      data: { element: result, edit: edit },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.edit) {
          this.fluxService.updateRating(
            result.element.id_user,
            result.element.movie.id,
            result.element.rating,
            result.element.comment
          );
          result.rating = 0;
          result.comment = '';
        } else {
          this.fluxService.addRating(
            result.movie.id,
            result.rating,
            result.comment
          );
          result.rating = 0;
          result.comment = '';
        }
      }
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

  sharePage(title : string, desc : string): void {
    const url = window.location.href;
  
    if (navigator.share) {
      navigator.share({
        title: title,
        text: desc,
        url: url,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback: Copier l'URL dans le presse-papiers et afficher un message
      navigator.clipboard.writeText(url).then(() => {
        alert('Lien copié dans le presse-papiers');
      }, () => {
        alert('Erreur lors de la copie du lien, veuillez copier manuellement.');
      });
    }
  }
  
}
