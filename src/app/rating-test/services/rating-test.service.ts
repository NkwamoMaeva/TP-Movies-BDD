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
  constructor(private readonly afs: AngularFirestore) {}
  addDocument() {
    const document = {
      date_created: new Date().toString(),
      id_movie: 27205,
      id_user: 'A9AuIFj5qpejKB1Hc2DIJ0qPAd02',
      rating: 5,
    };
    return this.afs.collection('Ratings').add(document);
  }
}
