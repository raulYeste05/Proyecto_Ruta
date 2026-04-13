import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const noAuthGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLogged()) {
    router.navigate(['/landing']);
    return false;
  }

  return true;
};
