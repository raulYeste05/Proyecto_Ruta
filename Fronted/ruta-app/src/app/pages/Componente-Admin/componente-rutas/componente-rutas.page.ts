import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { RutasService } from '../../../services/rutas.service';
import { addIcons } from 'ionicons';
import { trashOutline, mapOutline, timeOutline, trailSignOutline } from 'ionicons/icons';

import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonCard, 
  IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, 
  IonButton, IonIcon, IonBadge, AlertController, ToastController} from '@ionic/angular/standalone';


@Component({
  selector: 'app-componente-rutas',
  templateUrl: './componente-rutas.page.html',
  styleUrls: ['./componente-rutas.page.scss'],
  standalone: true,
  imports: [  
    IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonCard, 
    IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, 
    IonButton, IonIcon, IonBadge, CommonModule, FormsModule
  ]
})
export class ComponenteRutasPage implements OnInit {
  todasLasRutas: any[] = [];

  constructor(
    private rutasService: RutasService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    addIcons({ trashOutline, mapOutline, timeOutline, trailSignOutline });
  }

  ngOnInit() {
    this.cargarRutas();
  }

  cargarRutas() {
    // Usamos el método que trae TODO de la BD
    this.rutasService.getAllRutas().subscribe({
      next: (data) => this.todasLasRutas = data,
      error: (err) => console.error("Error cargando rutas", err)
    });
  }

  verRuta(id: number) {
    // Redirige al mapa del cliente pasando el ID
    this.router.navigate(['/componente-panel-cliente/mapa'], { queryParams: { idRuta: id } });
  }

  async confirmarEliminar(id: number) {
    const alert = await this.alertCtrl.create({
      header: '¿Eliminar Ruta (ADMIN)?',
      message: 'Se borrarán permanentemente la ruta, paradas y servicios asociados.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => { this.eliminarRuta(id); }
        }
      ]
    });
    await alert.present();
  }

  eliminarRuta(id: number) {
    this.rutasService.deleteRuta(id).subscribe({
      next: async () => {
        this.todasLasRutas = this.todasLasRutas.filter(r => r.id !== id);
        const toast = await this.toastCtrl.create({
          message: 'Ruta eliminada por el administrador',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      },
      error: (err) => console.error("Error al borrar", err)
    });
  }
}