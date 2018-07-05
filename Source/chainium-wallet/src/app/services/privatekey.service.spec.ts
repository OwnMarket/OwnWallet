import { TestBed, inject } from '@angular/core/testing';

import { PrivatekeyService } from './privatekey.service';

describe('PrivatekeyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrivatekeyService]
    });
  });

  it('should be created', inject([PrivatekeyService], (service: PrivatekeyService) => {
    expect(service).toBeTruthy();
  }));
});
