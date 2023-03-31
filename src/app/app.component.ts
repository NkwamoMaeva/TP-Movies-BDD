import { Component, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavigationEnd, Router } from '@angular/router';
import { AuthentificationService } from './authentification/services/authentification.service';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

import { RatingTest } from './rating-test/models/rating-test.model';
import { FluxListService } from './flux/services/flux-list.service';

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
  private readonly fluxService = inject(FluxListService);

  notif = this.fluxService.getNotif();

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
        // if(this.link !== '/flux') {
        //   this.getNotif();
        // }
        // else {
        //   this.notif. = 0;
        //   // this.changeNotifUser();
        // }
      }
    });

    this.auth.user.subscribe((user) => {
      if (user) {
        this.connected = true;
        this.user = user;
      }
    });
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

  private triggerNotification(id_movie: string, body: string) {
    if (Notification.permission === 'granted') {
      const options = {
        body: body,
      };
      new Notification(id_movie, options).addEventListener('click', () => {
        // Rediriger l'utilisateur vers la page "ratings"
        window.location.href = '/movies/' + id_movie;
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          const options = {
            body: body,
          };
          new Notification(id_movie, options).addEventListener('click', () => {
            // Rediriger l'utilisateur vers la page "ratings"
            window.location.href = '/';
          });
        }
      });
    }
  }
}
