import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthentificationService {
  constructor(
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    private router: Router
  ) {}
  // Sign up with email/password
  signUp(email: string, password: string, username: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        result.user?.updateProfile({ displayName: username });
        window.alert('You have been successfully registered!');
        console.log(result.user);
        localStorage.setItem('currentUser', JSON.stringify(result.user));
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
        console.log(result);
        this.router.navigate(['']);
      });
  }
}
