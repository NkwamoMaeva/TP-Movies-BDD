import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { inject, Injectable } from '@angular/core';
import { RatingTest, RatingTestResult } from '../models/rating-test.model';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class RatingTestService {
  userId = '';

  constructor(
    private readonly afs: AngularFirestore,
    private auth: AngularFireAuth
  ) {
    this.auth.user.subscribe((user) => {
      if (user) {
        this.userId = user.uid;
      } else {
        console.log('No user is currently signed in.');
      }
    });
  }
  addDocument() {
    const document = {
      date_created: new Date().toString(),
      id_movie: 27205,
      id_user: this.userId,
      rating: 4,
    };
    return this.afs.collection('Ratings').add(document);
  }
}
