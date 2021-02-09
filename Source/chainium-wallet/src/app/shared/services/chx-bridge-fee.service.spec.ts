import { TestBed } from '@angular/core/testing';

import { ChxBridgeFeeService } from './chx-bridge-fee.service';

describe('ChxBridgeFeeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChxBridgeFeeService = TestBed.get(ChxBridgeFeeService);
    expect(service).toBeTruthy();
  });
});
