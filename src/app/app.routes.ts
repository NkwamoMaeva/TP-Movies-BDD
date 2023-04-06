import { Route } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { AuthentificationComponent } from './authentification/authentification.component';
import { MoviePageComponent } from './movie-page/movie-page.component';
import { FluxListComponent } from './flux/flux-list.component';
import { ProfileComponent } from './profile/profile.component';
import { MovieDetailComponent } from './movie-page/movie-detail/movie-detail.component';

import { AuthGuard } from './auth.guard';

import { UsersComponent } from './users/users.component';
export const appRoutes: Route[] = [
  { path: '', component: HomepageComponent },
  { path: 'movies', component: MoviePageComponent },
  { path: 'movies/:id', component: MovieDetailComponent },
  { path: 'login', component: AuthentificationComponent },
  { path: 'register', component: AuthentificationComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'flux', component: FluxListComponent },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'profiles/:id', component: MovieDetailComponent },
];
