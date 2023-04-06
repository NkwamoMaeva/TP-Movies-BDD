import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { doc, getDoc, getFirestore } from '@angular/fire/firestore';
import { NavigationEnd, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { Movie } from 'src/app/movie-page/models/movie.model';
import { MovieListService } from 'src/app/movie-page/services/movie-list.service';
import { Flux, Profile, Rating } from '../models/flux.model';

@Injectable({
  providedIn: 'root',
})
export class FluxListService {
  userId = '';
  ratingLength$ = this.afs
    .collection('Ratings')
    .get()
    .pipe(map((snapshot) => snapshot.size));

  private readonly af = inject(AngularFirestore);
  private readonly auth = inject(AngularFireAuth);
  private readonly movieListService = inject(MovieListService);
  private readonly router = inject(Router);
  private ratingsCollection: AngularFirestoreCollection<Rating> =
    this.af.collection<Rating>('Ratings');

  public profiles: Observable<Profile[]> = this.af
    .collection<Profile>('Profile')
    .valueChanges();

  constructor(private readonly afs: AngularFirestore) {
    this.auth.user.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
      }
    });
  }

  public getFlux(): Observable<Flux[]> {
    return this.af
      .collection<Flux>('Ratings')
      .valueChanges()
      .pipe(
        map((response) => {
          response.forEach(async (result: any) => {
            let movie: Movie = {} as Movie;
            let user: Profile = {} as Profile;
            this.movieListService
              .getMovieById(result.id_movie)
              .subscribe((movieFlux: Movie) => {
                movie = movieFlux;
              });
            const db = getFirestore();
            const docRef = doc(db, 'Profile', result.id_user);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              user = docSnap.data() as Profile;
              const options = {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              } as const;
              const date = new Date(result.date_created);
              result.user = user;
              result.movie = movie;
              result.date_created = date.toLocaleDateString('en-US', options);
              return result as Flux;
            } else {
              console.log('Document does not exist');
              return {};
            }
          });
          return response;
        })
      );
  }
  public getFluxByMovieId(movieId: string): Observable<Flux[]> {
    return this.af
      .collection<Flux>('Ratings', (ref) =>
        ref.where('id_movie', '==', movieId)
      )
      .valueChanges()
      .pipe(
        map((response) => {
          response.forEach(async (result: any) => {
            let movie: Movie = {} as Movie;
            let user: Profile = {} as Profile;
            this.movieListService
              .getMovieById(result.id_movie)
              .subscribe((movieFlux: Movie) => {
                movie = movieFlux;
              });
            const db = getFirestore();
            const docRef = doc(db, 'Profile', result.id_user);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              user = docSnap.data() as Profile;
              const options = {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              } as const;
              const date = new Date(result.date_created);
              result.user = user;
              result.movie = movie;
              result.date_created = date.toLocaleDateString('en-US', options);
              return result as Flux;
            } else {
              console.log('Document does not exist');
              return {};
            }
          });
          return response;
        })
      );
  }

  public async changeNotif() {
    this.auth.user.subscribe(async (user) => {
      // eslint-disable-next-line no-empty
      if (user) {
        await this.af
          .collection('Ratings')
          .get()
          .subscribe(async (querySnapshot) => {
            const sizeRatings = querySnapshot.size;
            const notificationDocRef = this.af
              .collection('Profile')
              .doc(user.uid);
            await notificationDocRef.update({ notification: sizeRatings });
          });
      } else {
        console.log(null);
      }
    });
  }

  public updateRating(
    id_user: string,
    id_movie: number,
    rating: number,
    comment: string
  ) {
    // Vérifier si l'utilisateur a déjà noté ce film
    const query = this.ratingsCollection.ref
      .where('id_user', '==', id_user)
      .where('id_movie', '==', id_movie);

    query.get().then((querySnapshot) => {
      if (!querySnapshot.empty) {
        // Si l'utilisateur a déjà noté le film, mettre à jour la note existante
        querySnapshot.forEach((doc) => {
          doc.ref.update({ rating: rating, comment: comment });
        });
      }
    });
  }

  public getNotif(router: Router): Observable<number> {
    return router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      switchMap(() =>
        combineLatest([this.auth.user, this.ratingLength$]).pipe(
          switchMap(([user, query]) =>
            this.afs
              .doc<Profile>(`Profile/${user?.uid}`)
              .snapshotChanges()
              .pipe(
                map((doc) => {
                  const notif = doc.payload.data()?.notification;
                  if (router.url === '/flux') {
                    if (query !== notif) {
                      this.afs
                        .doc(`Profile/${user?.uid}`)
                        .update({ notification: query });
                    }

                    return 0;
                  } else {
                    console.log(query - (notif ? notif : 0) !== 0);
                    console.log(query);
                    if (query - (notif ? notif : 0) !== 0) {
                      this.watchRatings(
                        this.afs.collection<Rating>('Ratings', (ref) =>
                          ref.limit(query - (notif ? notif : 0))
                        )
                      );
                    }
                    return query - (notif ? notif : 0);
                  }
                })
              )
          )
        )
      )
    );
  }

  watchRatings(ratingCollection: AngularFirestoreCollection<Rating>) {
    ratingCollection.stateChanges(['added']).subscribe((changes) => {
      changes.forEach((change) => {
        const rating = change.payload.doc.data() as Rating;
        if (rating.rating === 4 || rating.rating === 5) {
          this.triggerNotification(
            `Nouvelle note ${rating.id_movie}`,
            `Nouvelle note ajoutée pour le film ${rating.id_movie}.`
          );
        }
      });
    });
  }

  private triggerNotification(id_movie: string, body: string) {
    if (Notification.permission === 'granted') {
      const options = {
        body: body,
      };
      new Notification(id_movie, options).addEventListener('click', () => {
        // Rediriger l'utilisateur vers la page "ratings"
        window.location.href = '/movies/' + id_movie;
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          const options = {
            body: body,
          };
          new Notification(id_movie, options).addEventListener('click', () => {
            // Rediriger l'utilisateur vers la page "ratings"
            window.location.href = '/';
          });
        }
      });
    }
  }

  addRating(movieId: number, rating: number, comment: string) {
    const document: Rating = {
      date_created: new Date().toString(),
      id_movie: movieId,
      id_user: this.userId,
      rating: rating,
      comment: comment,
    };
    return this.afs.collection('Ratings').add(document);
  }
}
