import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavigationEnd, Router } from '@angular/router';
import { AuthentificationService } from './authentification/services/authentification.service';
import { Observable } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

import { Profile } from './flux/models/flux.model';
import { RatingTest } from './rating-test/models/rating-test.model';

export interface Menu {
  name: string;
  link: string;
  icon: string;
}

@Component({
  selector: 'tp-movies-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  notif = 0;

  title = '';
  link = '/';
  user: firebase.default.User | null = null;
  connected = false;
  menus: Menu[] = [
    {
      name: 'Accueil',
      link: '/',
      icon: 'home',
    },
    {
      name: 'Wachlist',
      link: '/wachlist',
      icon: 'bookmark',
    },
    {
      name: 'Téléchargements',
      link: '/download',
      icon: 'download',
    },
    {
      name: 'Flux',
      link: '/flux',
      icon: '',
    },
  ];
  constructor(
    private router: Router,
    public auth: AngularFireAuth,
    public authService: AuthentificationService,
    private afs: AngularFirestore
  ) {
    router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.link = this.router.url;
        if(this.link !== '/flux') {
          this.getClients();
        }

      }
    });

    this.auth.user.subscribe((user) => {
      if (user) {
        this.connected = true;
        this.user = user;
      }
    }); 
    
  }

  getClients(): Observable<Profile[]> {
    this.auth.user.subscribe((user) => {
      if (user) {
        this.afs
          .doc<Profile>(`Profile/${user.uid}`)
          .valueChanges()
          .subscribe((notif) => {
            const lastLengthNotif = notif?.notification;
            this.afs
              .collection('Ratings')
              .get()
              .subscribe((querySnapshot) => {
                const sizeRatings = querySnapshot?.size;
                const sizeNotif = sizeRatings
                  ? lastLengthNotif
                    ? sizeRatings - lastLengthNotif
                    : 0
                  : 0;
                
                this.afs.collection<RatingTest>('Ratings', (ref) =>
                    ref.limit(sizeNotif)).stateChanges(['added']).subscribe((changes) => {
                      changes.forEach((change) => {
                        const rating = change.payload.doc.data() as RatingTest;
                        if (rating.rating === 4 || rating.rating === 5) {
                          this.notif = this.notif + 1;
                          this.triggerNotification(
                            `Nouvelle note ${rating.id_movie}`,
                            `Nouvelle note ajoutée pour le film ${rating.id_movie}.`
                          );
                        }
                      });
                    });
                // this.watchRatings(
                //   this.afs.collection<RatingTest>('Ratings', (ref) =>
                //     ref.limit(sizeNotif)
                //   )
                // );
              });
          });
      } else {
        console.log(null);
      }
    });
    return this.afs
      .collection<Profile>(`Profile`)
      .valueChanges({ idField: 'id' });
  }

  goToMenu(menu: string) {
    this.title = menu;
  }
  signOut() {
    console.log('Logout');
    this.auth.signOut().then((result) => {
      console.log(result);
    });
  }

  watchRatings(ratingCollection: AngularFirestoreCollection<RatingTest>) {
    ratingCollection.stateChanges(['added']).subscribe((changes) => {
      changes.forEach((change) => {
        const rating = change.payload.doc.data() as RatingTest;
        console.log(rating);
        if (rating.rating === 4 || rating.rating === 5) {
          this.triggerNotification(
            `Nouvelle note ${rating.id_movie}`,
            `Nouvelle note ajoutée pour le film ${rating.id_movie}.`
          );
        }
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
        window.location.href = '/details-fils/' + movie_name;
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
