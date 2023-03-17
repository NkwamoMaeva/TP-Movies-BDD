import { Component, inject, OnInit } from '@angular/core';
import { RatingTestService } from './services/notif-test.services';
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
  selector: 'tp-movies-notif-test',
  templateUrl: './notif-test.component.html',
})
export class NotifTestComponent {
  constructor(private rts: RatingTestService) {
  }
}
