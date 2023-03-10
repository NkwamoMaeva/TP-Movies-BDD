import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import {inject, Injectable} from '@angular/core';
import {RatingTest, RatingTestResult} from '../models/rating-test.model';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";


@Injectable({
  providedIn: 'root',
})
export class RatingTestService {
  private readonly af = inject(AngularFirestore)
  public flux: Observable<RatingTest[]> = this.af.collection<RatingTest>('Ratings').valueChanges()
}
