import { Component, OnInit } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { of, switchMap, tap, throwError } from 'rxjs';
import { UsersService } from './sevices/users.service';

@UntilDestroy()
@Component({
  selector: 'tp-movies-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user$ = this.usersService.currentUserProfile$;

  profileForm = this.fb.group({
    id_user: [''],
    firstname: [''],
    lastname: [''],
    email: [''],
    username: [''],
    photoURL : [''],
  });

  ngOnInit(): void {
    this.usersService.currentUserProfile$
      .pipe(
        untilDestroyed(this),
        tap(console.log),
        switchMap((user) =>
          user ? of(user) : throwError('Could not fetch user profile data')
        )
      )
      .subscribe({
        next: (user) => {
          if (user) {
            const { id_user, firstname, lastname, email, username } = user;
            this.profileForm.patchValue({
              id_user,
              firstname,
              lastname,
              email,
              username,
            });
          }
        },
        error: (err) => {
          console.error(err);
          // Show an error message to the user
        },
      });
  }

  constructor(
    private toast: HotToastService,
    private usersService: UsersService,
    private fb: NonNullableFormBuilder
  ) {}

 

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.user$.subscribe((user) => {
      this.usersService.uploadImage(file, user?.id_user ).subscribe((response) => {
        this.profileForm.patchValue({ photoURL: response});
      });
    });
  }
  

  saveProfile() {
    const { id_user, ...data} = this.profileForm.value;
    if (!id_user) {
      return;
    }
    this.usersService.updateUser({id_user, ...data }).pipe(
      
      this.toast.observe({
        loading: 'Saving profile data...',
        success: 'Profile updated successfully',
        error: 'There was an error in updating the profile',
      })
    ).subscribe;
  }
}
