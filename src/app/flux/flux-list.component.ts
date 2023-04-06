import { Component, Inject, inject } from '@angular/core';
import { FluxListService } from './services/flux-list.service';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Flux } from './models/flux.model';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

@Component({
  selector: 'tp-movies-movie-flux',
  templateUrl: './flux-list.component.html',
  styleUrls: ['./flux-list.component.scss'],
})
export class FluxListComponent {
  public readonly fluxService = inject(FluxListService);
  flux$: Observable<Flux[]> = this.fluxService.getFlux();
  userId = '';

  constructor(private auth: AngularFireAuth, public dialog: MatDialog) {
    this.fluxService.changeNotif();
    this.auth.user.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
      } else {
        console.log('No user is currently signed in.');
      }
    });
  }

  openDialog(element: any, edit: boolean) {
    if (this.userId == element.user.id_user) {
      edit = true;
    }
    const dialogRef = this.dialog.open(DialogFluxDetailComponent, {
      data: { element: element, edit: edit },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {
        this.fluxService.updateRating(
          result.user.id_user,
          result.movie.id,
          result.rating,
          result.comment
        );
      }
    });
  }
}

@Component({
  selector: 'tp-movies-dialog-flux-detail',
  templateUrl: 'dialog-flux-detail.html',
  styleUrls: ['./dialog-flux-detail.scss'],
})
export class DialogFluxDetailComponent {
  userId = '';
  private ratingsCollection: AngularFirestoreCollection<Flux> =
    this.db.collection<Flux>('Ratings');
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { element: any; edit: boolean },
    public dialogRef: MatDialogRef<DialogFluxDetailComponent>,

    private auth: AngularFireAuth,
    private db: AngularFirestore
  ) {
    this.auth.user.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
      } else {
        console.log('No user is currently signed in.');
      }
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  isUserConnected(data: Flux) {
    return this.userId === data.user.id_user;
  }

  updateComment(data: Flux) {
    const newComment = (<HTMLInputElement>document.getElementById('comment'))
      .value;
    const newRate = parseFloat(
      (<HTMLInputElement>document.getElementById('rate')).value
    );
    // Vérifier si l'utilisateur a déjà noté ce film
    const query = this.ratingsCollection.ref
      .where('id_user', '==', data.user.id_user)
      .where('id_movie', '==', data.movie.id);

    query.get().then((querySnapshot) => {
      // Si l'utilisateur a déjà noté le film, mettre à jour la note existante
      querySnapshot.forEach((doc) => {
        this.ratingsCollection
          .doc(doc.id)
          .update({
            comment: newComment,
            rating: newRate,
          })
          .then(() => {
            console.log('Document mis à jour avec succès');
          })
          .catch((error) => {
            console.error(
              'Erreur lors de la mise à jour du document : ',
              error
            );
          });
      });
    });
  }
}
