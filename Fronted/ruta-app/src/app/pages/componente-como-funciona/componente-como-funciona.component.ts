import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // <-- 1. IMPORTANTE PARA EL ROUTERLINK
import { IonicModule } from '@ionic/angular'; 
import { addIcons } from 'ionicons'; 
import { 
  personAddOutline, searchOutline, navigateOutline,
  homeOutline, helpCircleOutline, mailOutline, logInOutline // <-- 2. ICONOS DEL MENÚ MÓVIL
} from 'ionicons/icons';

@Component({
  selector: 'app-componente-como-funciona',
  templateUrl: './componente-como-funciona.component.html',
  styleUrls: ['./componente-como-funciona.component.scss'],
  standalone: true, 
  imports: [
    CommonModule, 
    IonicModule, 
    RouterModule // <-- 3. AÑADIDO AQUÍ PARA QUE FUNCIONE EL ROUTER
  ] 
})
export class ComponenteComoFuncionaComponent implements OnInit {

  constructor() {
    // Registramos absolutamente todos los iconos que se usan en la página
    addIcons({ 
      personAddOutline, 
      searchOutline, 
      navigateOutline,
      homeOutline,
      helpCircleOutline,
      mailOutline,
      logInOutline
    });
  }

  ngOnInit() {}
}