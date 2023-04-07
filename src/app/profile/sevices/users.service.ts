import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import {
  doc,
  docData,
  Firestore,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { finalize, from, Observable, of, switchMap, tap } from 'rxjs';
import { ProfileUser } from '../models/user';

import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  currentUser$ = authState(this.auth);
  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private storage: Storage
  ) {}

  get currentUserProfile$(): Observable<ProfileUser | null> {
    return this.currentUser$.pipe(
      tap((user) => console.log('current user:', user)),
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }
        const ref = doc(this.firestore, 'Profile', user?.uid);
        return docData(ref) as Observable<ProfileUser>;
      })
    );
  }


  uploadImage(image: File, userId?: string): Observable<string> {
    const filePath = `profile_photos/${userId}`;
    const storageRef = ref(this.storage, filePath);
    const uploadTask = from(uploadBytes(storageRef, image));

    return uploadTask.pipe(switchMap((result) => getDownloadURL(result.ref)));
  }

  updateUser(user: ProfileUser): Observable<void> {
    const ref = doc(this.firestore, 'Profile', user.id_user);
    return from(updateDoc(ref, { ...user }));
  }

  
}
