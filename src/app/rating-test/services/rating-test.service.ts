import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { inject, Injectable } from '@angular/core';
import { RatingTest, RatingTestResult } from '../models/rating-test.model';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class RatingTestService {

  constructor(private readonly afs: AngularFirestore) {
  }
  addDocument() {
    const document = {
      date_created: '10 mars 2023',
      id_user: 'jLyZyMIQv9Z53wMpI8XCnmKht513',
      movie_name: 'Star Wars',
      rating: 5,
      title: 'Star Wars',
      year: 2023,
    };
    return this.afs
      .collection('Ratings')
      .add(document);
  }

}
 
