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

  let clonedReq = req;

  if (token) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(clonedReq).pipe(
    catchError((err) => {

      if (err.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      }

      return throwError(() => err);
    })
  );
};
