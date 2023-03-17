import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { RatingTest } from '../../rating-test/models/rating-test.model';
import { Notif } from '../models/notif-test.model';

@Injectable({
  providedIn: 'root',
})
export class RatingTestService {
  private sizeNotif: number;
  constructor(
    private readonly afs: AngularFirestore,
    private readonly auth: AngularFireAuth
  ) {
   this.sizeNotif = 0;
  }
  getNotif() {
    this.auth.user.subscribe((user) => {
      if (user) {
        this.afs
          .doc<Notif>(`Notification/${user.uid}`)
          .valueChanges()
          .subscribe((notif) => {
            const lastLengthNotif = notif?.lastLengthNotif;
            this.afs
              .collection<RatingTest>('Ratings')
              .get()
              .subscribe((querySnapshot) => {
                const sizeRatings = querySnapshot.size;
                this.sizeNotif = sizeRatings
                  ? lastLengthNotif
                    ? sizeRatings - lastLengthNotif
                    : 0
                  : 0;
                this.sizeNotif != 0
                  ? this.watchRatings(
                      this.afs.collection<RatingTest>('Ratings', (ref) =>
                        ref.limit(this.sizeNotif)
                      )
                    )
                  : (this.sizeNotif = 0);
              });
          });
      } else {
        console.log(null);
      }
    });
    return this.sizeNotif;
  }
  watchRatings(ratingCollection: AngularFirestoreCollection<RatingTest>) {
    ratingCollection.stateChanges(['added']).subscribe((changes) => {
      changes.forEach((change) => {
        const rating = change.payload.doc.data() as RatingTest;
        this.triggerNotification(
          `Nouvelle note ${rating.movie_name}`,
          `Nouvelle note ajoutée pour le film ${rating.movie_name}.`
        );
      });
    });
  }

  private triggerNotification(movie_name: string, body: string) {
    if (Notification.permission === 'granted') {
      const options = {
        body: body,
      };
      new Notification(movie_name, options).addEventListener('click', () => {
        // Rediriger l'utilisateur vers la page "ratings"
        window.location.href = '/flux';
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          const options = {
            body: body,
          };
          new Notification(movie_name, options).addEventListener(
            'click',
            () => {
              // Rediriger l'utilisateur vers la page "ratings"
              window.location.href = '/';
            }
          );
        }
      });
    }
  }
}
