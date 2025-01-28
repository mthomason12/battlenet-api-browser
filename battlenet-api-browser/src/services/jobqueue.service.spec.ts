import { TestBed } from '@angular/core/testing';

import { JobQueueService } from './jobqueue.service';

describe('JobQueueService', () => {
  let service: JobQueueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobQueueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
