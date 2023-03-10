import {Component, inject, OnInit} from '@angular/core';
import {RatingTest} from "./models/rating-test.model";
import {RatingTestService} from "./services/rating-test.service";
import {Observable} from "rxjs/internal/Observable";
import {AsyncPipe, NgForOf} from "@angular/common";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import { Flux } from '../flux/models/flux.model';
import { FluxListService } from '../flux/services/flux-list.service';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'tp-movies-rating-test',
  templateUrl: './rating-test.component.html',
  styleUrls: ['./rating-test.component.scss'],
})
export class RatingTestComponent {
    notificationCount = 0;
    
    public readonly flux = inject(FluxListService).flux;
  constructor(private firestore:AngularFirestore) { 
    this.flux.subscribe((variable:Flux[]) => {
      this.notificationCount= variable.length
    })
  }
    addDocument(): void {
        const document = {
            date_created: '10 mars 2023',
            id_user: 'jLyZyMIQv9Z53wMpI8XCnmKht513',
            movie_name: 'Star Wars',
            rating: 5,
            title: 'Star Wars',
            year: 2023,
        };
        this.firestore.collection('Ratings').add(document).then(() => {
            if (Notification.permission === 'granted') {
              const notification = new Notification('Nouvelle note ajoutée', {
                body: 'Une nouvelle note a été ajoutée à la collection Ratings'
              });
            }
            this.notificationCount++;
          });
      };
}