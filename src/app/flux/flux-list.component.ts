import { Component, Inject, inject } from '@angular/core';
import { FluxListService } from './services/flux-list.service';
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
