import { Component } from '@angular/core';
import { ProfileService } from './services/users.service';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { ProfileUser } from '../profile/models/user';

@Component({
  selector: 'tp-movies-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

  public readonly searchValue = new BehaviorSubject<string>('');

  profiles$: Observable<ProfileUser[]> = this.searchValue
  .pipe(
    switchMap((type) => {
      return this.profileService.onSearch(type);
    })
  );
;

  constructor(private profileService: ProfileService) { }

  onSearch(event: any) {
    this.searchValue.next(event.target.value);
  }

  clearSearch() {
    this.searchValue.next('');
  }
}
