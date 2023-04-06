import { Component, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavigationEnd, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthentificationService } from './authentification/services/authentification.service';
import { FluxListService } from './flux/services/flux-list.service';

export interface Menu {
  name: string;
  link: string;
  icon: string;
  visible: boolean;
}

@Component({
  selector: 'tp-movies-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = '';
  link = '/';
  user: firebase.default.User | null = null;
  private readonly fluxService = inject(FluxListService);

  notif = this.fluxService.getNotif(this.router);
  isConnected: Observable<boolean> = this.auth.user.pipe(
    map((user) => {
      let value = false;
      if (user) {
        this.user = user;
        this.menus[1].visible = false;
        this.menus[2].visible = false;
        value = true;
      }
      return value;
    })
  );
  menus: Menu[] = [
    {
      name: 'Movies',
      link: '/movies',
      icon: 'theaters',
      visible: true,
    },
    {
      name: 'Search',
      link: '/users',
      icon: 'search',
      visible: true,
    },
    {
      name: 'Flux',
      link: '/flux',
      icon: 'equalizer',
      visible: true,
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
  }
  goToMenu(menu: string) {
    this.title = menu;
  }
  signOut() {
    console.log('Logout');
    this.auth.signOut().then(() => {
      this.router.navigate(['login']);
    });
  }
}
