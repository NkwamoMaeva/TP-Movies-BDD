import { Component } from '@angular/core';
import { AppService } from './app.service';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';


@Component({
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor],
  selector: 'cours-web-mobile-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  joke$ = this.appService.getJoke();
  popularMovies$ = this.appService.getPopularMovies();
  
  constructor(private readonly appService: AppService) {
    console.log(this.appService.getPopularMovies(), "ccc", this.appService.getJoke())
  }
}
