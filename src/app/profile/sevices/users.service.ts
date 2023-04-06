import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  docData,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { filter, from, map,tap, Observable, of, switchMap } from 'rxjs';
import { ProfileUser } from '../models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  
  constructor(private firestore: Firestore, private authService: AuthService) {}

  get currentUserProfile$(): Observable<ProfileUser | null> {
    return this.authService.currentUser$.pipe(
      tap(user => console.log('current user:', user)),
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }
        const ref = doc(this.firestore, 'Profile', user?.uid);
        return docData(ref) as Observable<ProfileUser>;
        
      })
    );
  }

  addUser(user: ProfileUser): Observable<void> {
    const ref = doc(this.firestore, 'Profile', user.id_user);
    return from(setDoc(ref, user));
    
  }

  updateUser(user: ProfileUser): Observable<void> {
    const ref = doc(this.firestore, 'Profile', user.id_user);
    return from(updateDoc(ref, { ...user }));
  }
}
