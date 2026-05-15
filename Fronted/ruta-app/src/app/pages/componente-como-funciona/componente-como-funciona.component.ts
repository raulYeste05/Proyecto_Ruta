import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular'; // Importante para las etiquetas ion-*
import { addIcons } from 'ionicons'; // Para registrar iconos
import { personAddOutline, searchOutline, navigateOutline } from 'ionicons/icons';

@Component({
  selector: 'app-componente-como-funciona',
  templateUrl: './componente-como-funciona.component.html',
  styleUrls: ['./componente-como-funciona.component.scss'],
  standalone: true, // Asegúrate de que tenga esto
  imports: [CommonModule, IonicModule] // Añade IonicModule aquí
})
export class ComponenteComoFuncionaComponent implements OnInit {

  constructor() {
    // Registramos los iconos que usas en tu HTML
    addIcons({ 
      personAddOutline, 
      searchOutline, 
      navigateOutline 
    });
  }

  ngOnInit() {}
}