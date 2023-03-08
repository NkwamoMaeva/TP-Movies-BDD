import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'tp-movies-login',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.scss'],
})
export class AuthentificationComponent {
  login = true;
  register = false;
  hide = true;
  signin: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required, Validators.min(6)]),
  });
  constructor(private router: Router) {
    if (this.router.url === '/register') {
      this.register = true;
      this.login = false;
    } else {
      this.login = true;
      this.register = false;
    }
  }

  get passwordInput() {
    return this.signin.get('password');
  }
}
