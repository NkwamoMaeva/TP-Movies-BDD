import { Route } from '@angular/router';
import { AuthentificationComponent } from './authentification/authentification.component';
export const appRoutes: Route[] = [
  { path: 'login', component: AuthentificationComponent },
  { path: 'register', component: AuthentificationComponent },
];
