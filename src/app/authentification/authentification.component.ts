import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthentificationService } from './services/authentification.service';
@Component({
  selector: 'tp-movies-login',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.scss'],
})
export class AuthentificationComponent {
  login = true;
  register = false;
  hide = true;
  email = '';
  password = '';
  signin = this.fb.group(
    {
      email: [''],
      password: [
        '',
        {
          validators: [Validators.required, Validators.minLength(6)],
          updateOn: 'change',
        },
      ],
    },
    {
      asyncValidators: [],
    }
  );

  signIn() {
    console.log(this.signin.get('email'));
    this.authService
      .signIn(
        this.signin.get('email')?.value ?? '',
        this.signin.get('password')?.value ?? ''
      )
      .then((result) => {
        console.log(result);
      });
  }

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public authService: AuthentificationService
  ) {
    if (this.router.url === '/register') {
      this.register = true;
      this.login = false;
    } else {
      this.login = true;
      this.register = false;
    }
  }

  get EmailInput() {
    return this.signin.get('email');
  }
  get passwordInput() {
    return this.signin.get('password');
  }
}
