import { TestBed } from '@angular/core/testing';

import { ExtensionManagerService } from './extension-manager.service';

describe('ExtensionManagerService', () => {
  let service: ExtensionManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtensionManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
