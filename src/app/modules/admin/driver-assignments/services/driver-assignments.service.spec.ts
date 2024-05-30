import { TestBed } from '@angular/core/testing';

import { DriverAssignmentsService } from './driver-assignments.service';

describe('DriverAssignmentsService', () => {
  let service: DriverAssignmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DriverAssignmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
