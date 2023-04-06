import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap, tap } from 'rxjs';
import { AuthentificationService } from '../authentification/services/authentification.service';
import { ProfileUser } from './models/user';
import { ImageUploadService } from './sevices/image-upload.service';
import { UsersService } from './sevices/users.service';
import { of, throwError } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'tp-movies-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user$ = this.usersService.currentUserProfile$;

  profileForm = this.fb.group({
    id_user: [''],
    firstname: [''],
    lastname: [''],
    email: [''],
    username: [''],
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
    private authService: AuthentificationService,
    private imageUploadService: ImageUploadService,
    private toast: HotToastService,
    private usersService: UsersService,
    private fb: NonNullableFormBuilder
  ) {}

  // uploadFile(event: any, { uid }: ProfileUser) {
  //   this.imageUploadService
  //     .uploadImage(event.target.files[0], `images/profile/${uid}`)
  //     .pipe(
  //       this.toast.observe({
  //         loading: 'Uploading profile image...',
  //         success: 'Image uploaded successfully',
  //         error: 'There was an error in uploading the image',
  //       }),
  //       switchMap((photoURL) =>
  //         this.usersService.updateUser({
  //           uid,
  //           photoURL,
  //         })
  //       )
  //     )
  //     .subscribe();
  // }

  saveProfile() {
    console.log('helle je suis là', this.profileForm.value);
    const { id_user, ...data } = this.profileForm.value;
    console.log('helle je suis là2222', { id_user, ...data });
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
