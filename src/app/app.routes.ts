import { Route } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { AuthentificationComponent } from './authentification/authentification.component';
import { MoviePageComponent } from './movie-page/movie-page.component';
import {FluxListComponent} from "./flux/flux-list.component";
import { RatingTestComponent } from './rating-test/rating-test.component';
export const appRoutes: Route[] = [
  { path: '', component: HomepageComponent },
  { path: 'movie', component: MoviePageComponent },
  { path: 'login', component: AuthentificationComponent },
  { path: 'register', component: AuthentificationComponent },
  { path: 'flux', component: FluxListComponent },
  { path: 'rating-test', component: RatingTestComponent },
];
