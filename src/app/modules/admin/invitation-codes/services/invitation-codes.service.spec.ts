import { TestBed } from '@angular/core/testing';

import { InvitationCodesService } from './invitation-codes.service';

describe('InvitationCodesService', () => {
  let service: InvitationCodesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvitationCodesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
