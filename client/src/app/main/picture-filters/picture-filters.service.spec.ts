import { TestBed } from '@angular/core/testing';

import { PictureFiltersService } from './picture-filters.service';

describe('PictureFiltersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PictureFiltersService = TestBed.get(PictureFiltersService);
    expect(service).toBeTruthy();
  });
});
