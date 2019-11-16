import { TestBed } from '@angular/core/testing';

import { OwnModalService } from './own-modal.service';

describe('OwnModalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OwnModalService = TestBed.get(OwnModalService);
    expect(service).toBeTruthy();
  });
});
