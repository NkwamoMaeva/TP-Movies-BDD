import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import { HotToastModule } from '@ngneat/hot-toast';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ServiceWorkerModule } from '@angular/service-worker';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './material.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { HomepageComponent } from './homepage/homepage.component';
import { AuthentificationComponent } from './authentification/authentification.component';
import { MoviePageComponent } from './movie-page/movie-page.component';
import { MovieListComponent } from './movie-page/movie-list/movie-list.component';
import {
  DialogFluxDetailComponent,
  FluxListComponent,
} from './flux/flux-list.component';

import { MovieListService } from './movie-page/services/movie-list.service';
import { MovieDetailComponent } from './movie-page/movie-detail/movie-detail.component';
import { AuthentificationService } from './authentification/services/authentification.service';
import { UsersComponent } from './users/users.component';

import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { ProfileComponent } from './profile/profile.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HotToastService } from '@ngneat/hot-toast';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    AuthentificationComponent,
    MoviePageComponent,
    MovieListComponent,
    ProfileComponent,
    FluxListComponent,
    MovieDetailComponent,
    DialogFluxDetailComponent,
    UsersComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    BrowserAnimationsModule,
    MaterialModule,
    MatDialogModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    NgbModule,

    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    HotToastModule.forRoot(),
    MatMenuModule,
  ],
  providers: [
    MovieListService,
    AuthentificationService,
    ProfileComponent,
    HotToastService,
    {
      provide: MatDialogRef,
      useValue: {},
    },
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
  ],
  bootstrap: [AppComponent],
  exports: [
    AuthentificationComponent,
    HomepageComponent,
    MoviePageComponent,
    MovieListComponent,
    ProfileComponent,
    MovieDetailComponent,
    FluxListComponent,
    UsersComponent
  ],
})
export class AppModule {
  constructor(
    private afAuth: AngularFireAuth // Inject Firebase auth service
  ) {
    this.afAuth.onAuthStateChanged((user: any) => {
      if (user) {
        localStorage.setItem('connected', 'true');
      } else {
        localStorage.setItem('connected', 'false');
        console.log('Is not connected at all');
      }
    });
  }
}
