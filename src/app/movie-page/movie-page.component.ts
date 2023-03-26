import {
  Component,
  inject,
  ViewChild,
  HostListener,
  ElementRef,
} from '@angular/core';
import {
  BehaviorSubject,
  map,
  Observable,
  switchMap,
  combineLatest,
} from 'rxjs';
import { MoviesResponse } from './models/movie.model';
import { GenresService } from './services/genre.service';
import { MovieListService } from './services/movie-list.service';
import { Genre } from './models/genre.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

@Component({
  selector: 'tp-movies-movie-page',
  templateUrl: './movie-page.component.html',
  styleUrls: ['./movie-page.component.scss'],
})
export class MoviePageComponent {
  private readonly genresService = inject(GenresService);
  private readonly movieListService = inject(MovieListService);
  private readonly selectedGenres = new BehaviorSubject<number[]>([]);
  selectedGenresModel: number[] = [];
  public readonly type = new BehaviorSubject<string>('all');
  public readonly searchValue = new BehaviorSubject<string>('');

  typeFilter = 'all';
  types: string[] = ['all', 'trending', 'popular', 'show'];
  private readonly pageIndex = new BehaviorSubject<number>(1);
  movies$: Observable<MoviesResponse> = combineLatest([
    this.type,
    this.selectedGenres,
    this.pageIndex,
    this.searchValue,
  ]).pipe(
    switchMap(([type, genre, page, search]) => {
      return this.movieListService.getMovies(type, page, genre, search);
    })
  );
  genres: Observable<{ id: string; name: string; selected: boolean }[]> =
    this.genresService.getGenres().pipe(
      map((objects: any) => {
        return objects.map((obj: Genre) => {
          return {
            ...obj,
            id: obj.id,
            name: obj.name,
            selected: false,
          };
        });
      })
    );

  constructor(private route: ActivatedRoute, private router: Router) {
    route.queryParams.subscribe((params) => {
      if (params['type']) {
        this.typeFilter = params['type'];
        this.type.next(params['type']);
      } else {
        this.typeFilter = 'all';
        this.type.next('all');
      }
    });
  }

  onGenre() {
    this.selectedGenres.next(this.selectedGenresModel);
  }
  onGenreMenu() {
    this.selectedGenres.next(this.selectedGenresModel);
  }
  onTypeChange(event: MatButtonToggleChange) {
    // this.type.next(event.value);
    this.router.navigate(['/movies'], { queryParams: { type: event.value } });
  }
  onSearch(event: any) {
    this.searchValue.next(event.target.value);
  }
  clearSearch() {
    this.searchValue.next('');
  }

  next() {
    this.pageIndex.next(this.pageIndex.getValue() + 1);
  }
}
