import {Component, inject} from '@angular/core';
import {FluxListService} from "./services/flux-list.service";
import {Movie} from "../movie-page/models/movie.model";
import {MovieListService} from "../movie-page/services/movie-list.service";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Component({
  selector: 'tp-movies-movie-flux',
  templateUrl: './flux-list.component.html',
  styleUrls: ['./flux-list.component.scss'],
})
export class FluxListComponent {
  public readonly flux = inject(FluxListService).flux
  public readonly profiles = inject(FluxListService).profiles;
  movies: Movie[] = [];
  userId = '';
  newNoteValue = '';
  private ratingsCollection: AngularFirestoreCollection<any>;
  ratings: Observable<any[]>;

  constructor(private fluxService : FluxListService, private movieListService: MovieListService,
              private readonly rts: FluxListService, private auth: AngularFireAuth, private afs: AngularFirestore) {
    this.fluxService.changeNotif();
    this.movieListService.getMovies('all', 1).subscribe((movies) => {
      this.movies = movies.results;
      // this.applyFilter(this.selectedGenre);
    });
    this.auth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
      } else {
        console.log('No user is currently signed in.');
      }
    });
    this.ratingsCollection = afs.collection<any>('Ratings');
    this.ratings = this.ratingsCollection.valueChanges();
  }

  // Cette fonction est appelée lorsque l'utilisateur clique sur la note
  updateRating(id_user: string, id_movie: number) {
    // Vérifier si l'utilisateur a déjà noté ce film
    const query = this.ratingsCollection.ref.where('id_user', '==', id_user).where('id_movie', '==', id_movie);
    query.get().then(querySnapshot => {
      if (querySnapshot.empty) {
        // Si l'utilisateur n'a pas encore noté le film, ajouter une nouvelle note à Firestore
        this.ratingsCollection.add({
          id_user: id_user,
          id_movie: id_movie,
          rating: this.newNoteValue,
          date_created: new Date().toLocaleString(),
        });
      } else {
        // Si l'utilisateur a déjà noté le film, mettre à jour la note existante
        querySnapshot.forEach(doc => {
          const docRef = this.ratingsCollection.doc(doc.id);
          docRef.update({rating: this.newNoteValue});
        });
      }
    });
  }
}