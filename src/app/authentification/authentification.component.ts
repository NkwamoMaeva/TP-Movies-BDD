import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Validators,
  FormBuilder,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthentificationService } from '../authentification/services/authentification.service';
@Component({
  selector: 'tp-movies-login',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.scss'],
})
export class AuthentificationComponent {
  login = true;
  register = false;
  hide = true;
  signin = this.fb.group(
    {
      email: [
        '',
        {
          validators: [Validators.required, Validators.email],
          updateOn: 'change',
        },
      ],
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

  signup = this.fb.group(
    {
      username: [
        '',
        {
          validators: [Validators.required, Validators.minLength(6)],
          updateOn: 'change',
        },
      ],
      email: [
        '',
        {
          validators: [Validators.required, Validators.email],
          updateOn: 'change',
        },
      ],
      password: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(6),
            this.matchValidator('confirmPassword', true),
          ],
          updateOn: 'change',
        },
      ],
      confirmPassword: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(6),
            this.matchValidator('password'),
          ],
          updateOn: 'change',
        },
      ],
    },
    {
      asyncValidators: [],
    }
  );

  signIn() {
    if (this.signin.valid) {
      this.authService
        .signIn(
          this.signin.get('email')?.value ?? '',
          this.signin.get('password')?.value ?? ''
        )
        .then(() => {
          this.snackBar.open('Successfully connected', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        })
        .catch((error) => {
          this.snackBar.open(error.message, 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        });
    }
  }
  signUp() {
    if (this.signup.valid) {
      this.authService
        .signUp(
          this.signup.get('email')?.value ?? '',
          this.signup.get('password')?.value ?? '',
          this.signup.get('username')?.value ?? ''
        )
        .then(() => {
          this.router.navigate(['login']);
        });
    }
  }

  matchValidator(matchTo: string, reverse?: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.parent && reverse) {
        const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
        if (c) {
          c.updateValueAndValidity();
        }
        return null;
      }
      return !!control.parent &&
        !!control.parent.value &&
        control.value === (control.parent?.controls as any)[matchTo].value
        ? null
        : { matching: true };
    };
  }

  constructor(
    private snackBar: MatSnackBar,
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
}
