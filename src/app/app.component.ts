import { Component } from '@angular/core';

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
  title = 'tp-movies';
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
}
