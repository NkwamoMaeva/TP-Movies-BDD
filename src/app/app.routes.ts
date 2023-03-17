import { Route } from '@angular/router';
import { AuthentificationComponent } from './authentification/authentification.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import {FluxListComponent} from "./flux/flux-list.component";
import { RatingTestComponent } from './rating-test/rating-test.component';
import { NotifTestComponent } from './notif-test/notif-test.component';
export const appRoutes: Route[] = [
  { path: '', component: MovieListComponent },
  { path: 'login', component: AuthentificationComponent },
  { path: 'register', component: AuthentificationComponent },
  { path: 'flux', component: FluxListComponent },
  { path: 'rating-test', component: RatingTestComponent },
  { path: 'notif-test', component: NotifTestComponent },
];
