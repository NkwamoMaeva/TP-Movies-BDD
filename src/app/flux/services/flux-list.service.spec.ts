import { TestBed } from '@angular/core/testing';

import { FluxListService } from './flux-list.service';

describe('FluxListService', () => {
  let service: FluxListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FluxListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
