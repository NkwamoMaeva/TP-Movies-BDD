import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RatingTestService } from './notif-test/services/notif-test.services';

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
  constructor(private router: Router, private rts: RatingTestService) {
    this.notif = this.rts.getNotif();
    
    router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.link = this.router.url;
      }
    });
  }
  notif = 10;
  title = '';
  link = '/';

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
  ];

  goToMenu(menu: string) {
    this.title = menu;
  }
}
