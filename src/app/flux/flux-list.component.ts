import { Component, Inject, inject } from '@angular/core';
import { FluxListService } from './services/flux-list.service';
import { BehaviorSubject, Observable, combineLatest, switchMap } from 'rxjs';
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
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'tp-movies-movie-flux',
  templateUrl: './flux-list.component.html',
  styleUrls: ['./flux-list.component.scss'],
})
export class FluxListComponent {
  typeFilter = 'all';
  types: string[] = ['all', 'mines'];
  public readonly type = new BehaviorSubject<string>('all');

  public readonly fluxService = inject(FluxListService);

  flux$: Observable<(Flux | null)[]> = this.type.pipe(
    switchMap((type) => {
      
      return this.fluxService.getFlux(type);
    })
  );

  userId = '';

  constructor(
    private auth: AngularFireAuth,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.auth.user.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
      } else {
        console.log('No user is currently signed in.');
      }
    });
    route.queryParams.subscribe((params) => {
      if (params['type']) {
        this.typeFilter = params['type'];
        this.type.next(params['type']);
      } else {
        this.typeFilter = 'all';
        this.type.next('all');
      }
    });
  }
  onTypeChange(event: MatButtonToggleChange) {
    this.router.navigate(['/flux'], { queryParams: { type: event.value } });
  }

  openDialog(element: any, edit: boolean) {
    if (this.userId == element.user.id_user) {
      edit = true;
    }
    const dialogRef = this.dialog.open(DialogFluxDetailComponent, {
      data: { element: element, edit: edit },
    });
    dialogRef.afterClosed().subscribe((result) => {
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
}
