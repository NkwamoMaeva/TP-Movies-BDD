import { Component } from '@angular/core';
import { Flux } from './models/flux.model';
import { FluxListService } from './services/flux-list.service';

@Component({
  selector: 'tp-movies-movie-list',
  templateUrl: './flux-list.component.html',
  styleUrls: ['./flux-list.component.scss'],
})
export class FluxListComponent {
  flux: Flux[] = [];
  genres = [
    { name: 'Ascending date', selected: false },
    { name: 'Sate descending', selected: false }
  ];
  selectedGenres = [];
  query = '';

  constructor(private fluxListService: FluxListService) {
    this.fluxListService.getMovies().subscribe((flux) => {
      this.flux = flux.results;
      // this.applyFilter(this.selectedGenre);
    });
  }
}
