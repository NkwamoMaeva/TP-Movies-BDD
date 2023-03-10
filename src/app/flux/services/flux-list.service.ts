import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import {inject, Injectable} from '@angular/core';
import {Flux, FluxResult} from '../models/flux.model';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";


@Injectable({
  providedIn: 'root',
})
export class FluxListService {
  private readonly af = inject(AngularFirestore)
  public flux: Observable<Flux[]> = this.af.collection<Flux>('Ratings').valueChanges()
}
