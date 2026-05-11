import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const salirGuard: CanDeactivateFn<any> = (component) => {
  const authService = inject(AuthService);
  
  // Si el usuario ya no está logueado (porque dio a cerrar sesión), lo dejamos pasar
  if (!authService.isLogged()) {
    return true;
  }

  // Mostrar mensaje de confirmación nativo del navegador
  const confirmar = confirm('¿Quieres salir de la página y cerrar sesión?');

  if (confirmar) {
    authService.logout(); // Borramos el token y localStorage
    return true; // Permite la navegación
  } else {
    return false; // Bloquea la navegación y se queda donde está
  }
};