import { Component, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavigationEnd, Router } from '@angular/router';
import { AuthentificationService } from './authentification/services/authentification.service';
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

  notif = this.fluxService.getNotif(this.router);

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
    public authService: AuthentificationService
  ) {
    router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.link = this.router.url;
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
}
