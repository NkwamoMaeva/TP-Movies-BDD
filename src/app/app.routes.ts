import { Route } from '@angular/router';
import { AuthentificationComponent } from './authentification/authentification.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { ProfileComponent } from './profile/profile.component';
export const appRoutes: Route[] = [
  { path: '', component: MovieListComponent },
  { path: 'login', component: AuthentificationComponent },
  { path: 'register', component: AuthentificationComponent },
  { path: 'profile', component: ProfileComponent  },

  
];
