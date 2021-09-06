import { TestBed } from '@angular/core/testing';

import { CentreFirebaseService } from './centre-firebase.service';

describe('CentreFirebaseService', () => {
  let service: CentreFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CentreFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
