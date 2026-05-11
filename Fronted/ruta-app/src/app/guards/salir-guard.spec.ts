import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { salirGuard } from './salir-guard';

describe('salirGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => salirGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
