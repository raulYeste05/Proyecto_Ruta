import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy } from '@ionic/angular';
import {authInterceptor} from './app/interceptors/auth-interceptor';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideIonicAngular } from '@ionic/angular/standalone';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({ 
      mode: 'md',
      inputShims: true, // <--- Evita el error de setFocus en web
      scrollAssist: false, // <--- Evita que el scroll de Ionic bloquee el foco en navegadores móviles
      hideCaretOnScroll: true
    }),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});