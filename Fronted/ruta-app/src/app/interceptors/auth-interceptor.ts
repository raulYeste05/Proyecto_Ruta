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

  // 1. EXCEPCIONES: No añadimos el token de nuestra DB si:
  // - Es una ruta de login/registro (/auth/)
  // - Es una ruta para el mapa (/ors/)
  if (req.url.includes('/auth/') || req.url.includes('/ors/')) {
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
      // Solo hacemos logout si el error 401 viene de nuestra API, no del mapa
      if (err.status === 401 && !req.url.includes('/ors/')) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};