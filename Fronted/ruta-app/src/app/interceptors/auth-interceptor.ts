import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);
  const authService = inject(AuthService);


  if (req.url.includes('/auth/') || req.url.includes('openrouteservice.org')) {
    return next(req); 
  }

  let clonedReq = req;

  // 2. Si hay token, lo añadimos solo para NUESTRA API de Spring Boot
  if (token) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(clonedReq).pipe(
    catchError((err) => {
      if (err.status === 401 && !req.url.includes('openrouteservice.org/ors/')) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};