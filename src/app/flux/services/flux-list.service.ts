import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import {inject, Injectable} from '@angular/core';
import {Flux, Profile} from '../models/flux.model';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class FluxListService {
  private readonly af = inject(AngularFirestore);
  private readonly auth = inject(AngularFireAuth);
  public flux: Observable<Flux[]> = this.af.collection<Flux>('Ratings').valueChanges()
  async changeNotif() {
    this.auth.user.subscribe((user) => {
      // eslint-disable-next-line no-empty
      if (user) {
        this.af
          .collection('Ratings')
          .get()
          .subscribe((querySnapshot) => {
            const sizeRatings = querySnapshot.size;
            const notificationDocRef = this.af
              .collection('Notification')
              .doc(user.uid);
            notificationDocRef.update({ lastLengthNotif: sizeRatings });
          });
      } else {
        console.log(null);
      }
    });
  }
}
