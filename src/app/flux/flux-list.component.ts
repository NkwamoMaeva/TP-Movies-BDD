import {Component, inject, OnInit} from '@angular/core';
import {Flux} from "./models/flux.model";
import {FluxListService} from "./services/flux-list.service";
import {Observable} from "rxjs/internal/Observable";
import {AsyncPipe, NgForOf} from "@angular/common";

@Component({
  selector: 'tp-movies-movie-list',
  templateUrl: './flux-list.component.html',
  styleUrls: ['./flux-list.component.scss'],
})
export class FluxListComponent {
  public readonly flux = inject(FluxListService).flux;
  public readonly profiles = inject(FluxListService).profiles;
  
  constructor(private fluxService : FluxListService) { 
    this.fluxService.changeNotif();
  }
}
