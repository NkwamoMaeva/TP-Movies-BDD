import { Component, inject, OnInit } from '@angular/core';
import { RatingTest } from './models/rating-test.model';
import { RatingTestService } from './services/rating-test.service';
import { Observable } from 'rxjs/internal/Observable';
import { AsyncPipe, NgForOf } from '@angular/common';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Flux } from '../flux/models/flux.model';
import { FluxListService } from '../flux/services/flux-list.service';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'tp-movies-rating-test',
  templateUrl: './rating-test.component.html',
  styleUrls: ['./rating-test.component.scss'],
})
export class RatingTestComponent {
  constructor(private rts: RatingTestService) {
    
  }
  addDocument() {
    this.rts.addDocument().then(() => {
      console.log('Document added');
    });
  }
}
