import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ProfileUser } from 'src/app/profile/models/user';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private firestore: AngularFirestore) {}

  searchProfiles(searchTerm: string): Observable<ProfileUser[]> {
    return this.firestore
      .collection<ProfileUser>('Profile', (ref) =>
        ref
          .where('username', '>=', searchTerm)
          .where('username', '<=', searchTerm + '\uf8ff')
          .orderBy('username')
      )
      .valueChanges();
  }

  public onSearch(search : string) : Observable<ProfileUser[]> {
    return this.searchProfiles(search);
  }

}
