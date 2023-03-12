import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { getAuth, signOut } from '@angular/fire/auth';

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
  signUp(email: string, password: string, username: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        result.user?.updateProfile({ displayName: username });
        const user: User = {
          username: result.user?.displayName ?? '',
          photo: '',
          firstname: '',
          lastname: '',
          id_user: result.user?.uid ?? '',
          email: result.user?.email ?? '',
        };
        this.firestore.collection('Profile').add(user);
        window.alert('You have been successfully registered!');
        console.log(result.user);
      })
      .catch((error) => {
        window.alert(error.message);
      });
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
