import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route) => {

  const router = inject(Router);
  const rol = localStorage.getItem('rol');

  const allowedRoles = route.data?.['roles'];

  if (allowedRoles && allowedRoles.includes(rol)) {
    return true;
  }

  router.navigate(['/landing']);
  return false;
};
