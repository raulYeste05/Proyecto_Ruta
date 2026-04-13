import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { noAuthGuard } from './guards/no-auth-guard';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
  path: 'landing',
  loadComponent: () => import('./pages/Componente-LandingPage/Componente-LandingPage')
    .then(m => m.LandingPage)
},
  {
    path:'login',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./pages/Componente-Login/Componente-Login.page').then(m => m.LoginPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/Componente-Registro/Componente-Registro.page')
      .then( m => m.RegistroPage)
  },
    {
    path: 'componente-panel-admin',
    loadComponent: () => import('./pages/Componente-Admin/componente-layout-admin/componente-layout-admin.page')
      .then(m => m.ComponenteLayoutAdminPage),
    children: [

      {
        path: '',
        redirectTo: 'usuarios',
        pathMatch: 'full'
      },

      {
        path: 'usuarios',
        loadComponent: () => import('./pages/Componente-Admin/componente-usuario/componente-usuario.page')
          .then(m => m.ComponenteUsuarioPage)
      },
      {
        path: 'clientes',
        loadComponent: () => import('./pages/Componente-Admin/componente-cliente/componente-cliente.page')
          .then(m => m.ComponenteClientePage),
      },
      {
        path: 'clientes/nuevo',
        loadComponent: () => import('./pages/Componente-Admin/componente-cliente-nuevo/componente-cliente-nuevo.page')
          .then(m => m.ComponenteClienteNuevoPage)
      },
      {
        path: 'clientes/editar/:id',
        loadComponent: () => import('./pages/Componente-Admin/componente-cliente-editar/componente-cliente-editar.page')
          .then(m => m.ComponenteClienteEditarPage)
      }


    ]
  },
 
  
  
];