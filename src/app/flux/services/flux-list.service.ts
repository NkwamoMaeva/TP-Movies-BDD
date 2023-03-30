import { Observable } from 'rxjs/internal/Observable';
import { inject, Injectable } from '@angular/core';
import { Flux, Profile } from '../models/flux.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';
import { MovieListService } from 'src/app/movie-page/services/movie-list.service';
import { Movie } from 'src/app/movie-page/models/movie.model';
import { doc, getDoc, getFirestore } from '@angular/fire/firestore';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class FluxListService {
  constructor(private readonly afs: AngularFirestore) {}

  private readonly af = inject(AngularFirestore);
  private readonly auth = inject(AngularFireAuth);
  private readonly movieListService = inject(MovieListService);
  private ratingsCollection: AngularFirestoreCollection<any> =
    this.af.collection<any>('Ratings');

  public profiles: Observable<Profile[]> = this.af
    .collection<Profile>('Profile')
    .valueChanges();

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

  public async changeNotif() {
    this.auth.user.subscribe((user) => {
      // eslint-disable-next-line no-empty
      if (user) {
        this.af
          .collection('Ratings')
          .get()
          .subscribe((querySnapshot) => {
            const sizeRatings = querySnapshot.size;
            const notificationDocRef = this.af
              .collection('Profile')
              .doc(user.uid);
            notificationDocRef.update({ notification: sizeRatings });
          });
      } else {
        console.log(null);
      }
    });
  }

  public addNote(id_user: string, id_movie: number, rating: number) {
    const document = {
      date_created: new Date().toLocaleString(),
      id_movie: id_movie,
      id_user: id_user,
      rating: rating,
    };
    return this.afs.collection('Ratings').add(document);
  }

  public updateRating(id_user: string, id_movie: number, rating: number) {
    // Vérifier si l'utilisateur a déjà noté ce film
    const query = this.ratingsCollection.ref
      .where('id_user', '==', id_user)
      .where('id_movie', '==', id_movie);
    query.get().then((querySnapshot) => {
      if (querySnapshot.empty) {
        // Si l'utilisateur n'a pas encore noté le film, ajouter une nouvelle note à Firestore
        this.ratingsCollection.add({
          id_user: id_user,
          id_movie: id_movie,
          rating: rating,
          date_created: new Date().toLocaleString(),
        });
      } else {
        // Si l'utilisateur a déjà noté le film, mettre à jour la note existante
        querySnapshot.forEach((doc) => {
          const docRef = this.ratingsCollection.doc(doc.id);
          docRef.update({ rating: rating });
        });
      }
    });
  }
}
