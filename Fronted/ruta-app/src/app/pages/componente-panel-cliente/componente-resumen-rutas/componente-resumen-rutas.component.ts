import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RutasService } from '../../../services/rutas.service';
import { ClienteService } from '../../../services/cliente.service';
import { PublicacionesService } from '../../../services/publicaciones.service';
import { Router } from '@angular/router';

import { AlertController, ToastController } from '@ionic/angular/standalone';

import { 
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, 
  IonContent, IonList, IonCard, IonCardHeader, IonCardTitle, 
  IonCardSubtitle, IonButton, IonIcon, IonBadge, IonCardContent, 
  IonRow, IonCol 
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { trashOutline, timeOutline, mapOutline, shareSocialOutline, trailSignOutline, closeCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-componente-resumen-rutas',
  templateUrl: './componente-resumen-rutas.component.html',
  styleUrls: ['./componente-resumen-rutas.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonHeader, 
    IonToolbar, 
    IonButtons, 
    IonBackButton, 
    IonTitle, 
    IonContent, 
    IonList, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardSubtitle, 
    IonButton, 
    IonIcon, 
    IonBadge, 
    IonCardContent, 
    IonRow, 
    IonCol
  ]
})
export class ComponenteResumenRutas implements OnInit {
  misRutas: any[] = [];
  userIdActual!: number; 
  rutaSeleccionada: any = null;

  constructor(
    private rutasService: RutasService,
    private clienteService: ClienteService,
    private publicacionesService: PublicacionesService,
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController, 
    private zone: NgZone
  ) {
    addIcons({ trashOutline, timeOutline, mapOutline, shareSocialOutline, trailSignOutline, closeCircleOutline });
  }

  ngOnInit() {
    this.cargarMisRutas();
  }

  cargarMisRutas() {
    this.clienteService.getPerfil().subscribe({
      next: (perfil) => {
        this.zone.run(() => {
          this.userIdActual = perfil.userId; 
          this.rutasService.getHistorialUsuario(perfil.userId).subscribe({
            next: (routes) => {
              this.misRutas = routes;
            }
          });
        });
      }
    });
  }

  formatearTiempo(minutosTotales: number): string {
    if (!minutosTotales || minutosTotales <= 0) return '0 min';
    const horas = Math.floor(minutosTotales / 60);
    const minutos = Math.round(minutosTotales % 60);
    if (horas > 0) {
      return `${horas}h ${minutos > 0 ? minutos + 'min' : ''}`;
    }
    return `${minutos} min`;
  }

  verRuta(id: number) {
    this.router.navigate(['/componente-panel-cliente/mapa'], { queryParams: { idRuta: id } });
  }



  async confirmarEliminar(id: number) {
    const alert = await this.alertCtrl.create({
      header: '¿Eliminar ruta?',
      message: 'Esta acción borrará la ruta y todas sus paradas de forma permanente.',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.eliminarRuta(id);
          }
        }
      ]
    });
    await alert.present();
  }

  async publicarRuta(ruta: any) {
    this.rutaSeleccionada = ruta;
    const alert = await this.alertCtrl.create({
      header: 'Publicar en Comunidad',
      subHeader: 'Ruta: ' + (ruta.titulo || ''),
      cssClass: 'custom-alert',
      inputs: [
        {
          name: 'contenido',
          type: 'textarea',
          placeholder: 'Cuéntales a otros qué tiene de especial esta ruta...'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Publicar',
          handler: (data) => {
            this.enviarPublicacion(ruta.id, ruta.titulo, data.contenido);
          }
        }
      ]
    });
    await alert.present();
  }

  async confirmarQuitarPublicacion(ruta: any) {
    const alert = await this.alertCtrl.create({
      header: 'Retirar del foro',
      message: '¿Seguro que quieres quitar esta publicación de la sección de la comunidad?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Quitar',
          role: 'destructive',
          handler: () => {
            this.quitarPublicacion(ruta.id);
          }
        }
      ]
    });
    await alert.present();
  }

  // ==========================================
  // LÓGICA DE PROCESAMIENTO DE PETICIONES
  // ==========================================

  eliminarRuta(id: number) {
    this.rutasService.deleteRuta(id).subscribe({
      next: () => {
        this.zone.run(async () => {
          this.misRutas = this.misRutas.filter(r => r.id !== id);
          const toast = await this.toastCtrl.create({
            message: 'Ruta eliminado correctamente',
            duration: 2000,
            color: 'success',
            cssClass: 'custom-toast'
          });
          await toast.present();
        });
      },
      error: (err) => console.error("Error al borrar ruta", err)
    });
  }

  private enviarPublicacion(rutaId: number, titulo: string, contenido: string) {
    if (!this.userIdActual) {
      console.error("No se puede publicar: ID de usuario no encontrado");
      return;
    }
    
    const datos = {
      userId: this.userIdActual,
      rutaId: rutaId,
      titulo: '¡Nueva ruta!: ' + titulo,
      contenido: contenido
    };

    this.publicacionesService.crearPublicacion(datos).subscribe({
      next: () => {
        this.zone.run(async () => {
          const toast = await this.toastCtrl.create({
            message: '¡Ruta compartida en la comunidad!',
            duration: 2500,
            color: 'success',
            position: 'middle',
            cssClass: 'toast-centrado'
          });
          await toast.present();
          this.cargarMisRutas();
        });
      },
      error: (err) => console.error("Error al publicar", err)
    });
  }

  private quitarPublicacion(rutaId: number) {
    this.publicacionesService.eliminarPublicacionPorRuta(rutaId).subscribe({
      next: () => {
        this.zone.run(async () => {
          const toast = await this.toastCtrl.create({
            message: 'Ruta retirada de la comunidad.',
            duration: 2000,
            color: 'warning',
            position: 'middle'
          });
          await toast.present();
          this.cargarMisRutas();
        });
      },
      error: (err) => console.error("Error al retirar la publicación", err)
    });
  }
}