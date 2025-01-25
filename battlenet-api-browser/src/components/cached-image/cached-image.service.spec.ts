import { TestBed } from '@angular/core/testing';

import { CachedImageService } from './cached-image.service';

describe('CachedImageService', () => {
  let service: CachedImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CachedImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
