import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para el pipe async o directivas básicas
import { ClienteService } from '../../../services/cliente.service'; // Asegúrate de que la ruta es correcta
import { 
  IonGrid, IonCol, IonRow, IonCard, 
  IonCardHeader, IonCardTitle, IonCardContent, 
  IonIcon
} from "@ionic/angular/standalone";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-componente-inicio',
  templateUrl: './componente-inicio.component.html',
  styleUrls: ['./componente-inicio.component.scss'],
  standalone: true,
  imports: [
    CommonModule, // Añadimos esto
    IonGrid, IonCol, IonRow, IonCard, 
    IonCardHeader, IonCardTitle, IonCardContent, 
    IonIcon, RouterModule
  ]
})
export class ComponenteInicioComponent implements OnInit {
  
  cliente: any = null; // Aquí guardaremos los datos que vengan de Spring

  constructor(private clienteService: ClienteService) { }

  ngOnInit() {
    this.cargarDatosPerfil();
  }

  cargarDatosPerfil() {
    this.clienteService.getPerfil().subscribe({
      next: (data) => {
        this.cliente = data;
        console.log('Cliente cargado:', this.cliente);
      },
      error: (err) => {
        console.error('Error al cargar el perfil', err);
      }
    });
  }
}