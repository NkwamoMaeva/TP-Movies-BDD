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
      id_movie: 27205,
      id_user: 'jLyZyMIQv9Z53wMpI8XCnmKht513',
      rating: 5
    };
    return this.afs
      .collection('Ratings')
      .add(document);
  }

}
 
