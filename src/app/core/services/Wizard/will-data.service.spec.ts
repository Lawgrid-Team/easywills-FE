import { TestBed } from '@angular/core/testing';

import { WillDataService } from './will-data.service';

describe('WillDataService', () => {
  let service: WillDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WillDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
