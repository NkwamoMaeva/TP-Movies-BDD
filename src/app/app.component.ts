import { Component, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavigationEnd, Router } from '@angular/router';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { AuthentificationService } from './authentification/services/authentification.service';
import { FluxListService } from './flux/services/flux-list.service';
import { UsersService } from './profile/sevices/users.service';

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
  photoURL : string | undefined;
  private readonly fluxService = inject(FluxListService);

  user$ = this.usersService.currentUserProfile$;

  notif = this.fluxService.getNotif(this.router);
  isConnected: Observable<boolean> = this.auth.user.pipe(
    map((user) => {
      if (user) {
        this.user = user;
        this.menus[1].visible = true;
        this.menus[2].visible = true;
        return true;
      } else {
        this.user = null;
        this.menus[1].visible = false;
        this.menus[2].visible = false;
        return false;
      }
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
    public authService: AuthentificationService,
    private usersService : UsersService,
  ) {
    router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.link = this.router.url;
      }
    });
    this.usersService.currentUserProfile$.subscribe((user) => {
      this.photoURL = user?.photoURL ?? '';
    })
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
