import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { authState, getAuth, signOut } from '@angular/fire/auth';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthentificationService {
  constructor(
    private afAuth: AngularFireAuth, // Inject Firebase auth service
    private firestore: AngularFirestore,
    private router: Router
  ) {}
  // Sign up with email/password
  async signUp(email: string, password: string, username: string) {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      await result.user?.updateProfile({ displayName: username });

      const querySnapshot = await this.firestore
        .collection('Ratings')
        .get()
        .toPromise();
      const user: User = {
        username: result.user?.displayName ?? '',
        photo: '',
        firstname: '',
        lastname: '',
        id_user: result.user?.uid ?? '',
        email: result.user?.email ?? '',
        notification: querySnapshot?.size,
      };

      await this.firestore
        .collection('Profile')
        .doc(result.user?.uid)
        .set(user);
    } catch (error) {
      console.log(error);
    }
  }

  // Sign in with email/password
  signIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.router.navigate(['']);
      });
  }

  signOut() {
    const auth = getAuth();
    console.log(auth);
    signOut(auth)
      .then(() => {
        console.log('SignOut successful');
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
