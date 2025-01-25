import { TestBed } from '@angular/core/testing';

import { CachedFileService } from './cached-file.service';

describe('CachedImageService', () => {
  let service: CachedFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CachedFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
