import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RutasService } from '../../../services/rutas.service';
import { ClienteService } from '../../../services/cliente.service';
import { PublicacionesService } from '../../../services/publicaciones.service';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { trashOutline, timeOutline, mapOutline, shareSocialOutline, trailSignOutline, closeCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-componente-resumen-rutas',
  templateUrl: './componente-resumen-rutas.component.html',
  styleUrls: ['./componente-resumen-rutas.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ComponenteResumenRutas implements OnInit {
  misRutas: any[] = [];
  userIdActual!: number; // Para guardar el ID del usuario logueado

  constructor(
    private rutasService: RutasService,
    private clienteService: ClienteService,
    private publicacionesService: PublicacionesService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private zone: NgZone

  ) {
    addIcons({trashOutline, timeOutline, mapOutline, shareSocialOutline, trailSignOutline, closeCircleOutline});
  }

  ngOnInit() {
    this.cargarMisRutas();
  }

  cargarMisRutas() {
    // 1. Obtenemos el perfil para saber quién es el usuario
    this.clienteService.getPerfil().subscribe({
      next: (perfil) => {
        this.zone.run(() => {
        this.userIdActual = perfil.userId; // Guardamos el ID del usuario para usarlo en el método POST
        // 2. Llamamos al método listarPorUser que tienes en Spring Boot
        // Asegúrate de que en rutas.service.ts tengas: listarRutasUsuario(userId: number)
        this.rutasService.getHistorialUsuario(perfil.userId).subscribe({
          next: (rutas) => {
            this.misRutas = rutas;
          }
        });
        });
      }
    });
  }


  // Método para convertir minutos a formato legible
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
    this.router.navigate(['/componente-panel-cliente/mapa'], {queryParams: {idRuta: id}});
  }

  // Método para confirmar la eliminación de una ruta
  async confirmarEliminar(id: number) {
    this.zone.run(async () => {
    const alert = await this.alertCtrl.create({
      header: '¿Eliminar ruta?',
      message: 'Esta acción borrará la ruta y todas sus paradas de forma permanente.',
      cssClass: 'custom-alert',
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
    });
  }

  eliminarRuta(id: number) {
    this.rutasService.deleteRuta(id).subscribe({
      next: () => {
        // Ejecutamos la actualización de la lista y el Toast en la zona activa
        this.zone.run(async () => {
          this.misRutas = this.misRutas.filter(r => r.id !== id);
          const toast = await this.toastCtrl.create({
            message: 'Ruta eliminada correctamente',
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

  async publicarRuta(ruta: any) {
    this.zone.run(async () => {
      const alert = await this.alertCtrl.create({
        header: 'Publicar en Comunidad',
        subHeader: `Ruta: ${ruta.titulo}`,
        inputs: [
          {
            name: 'contenido',
            type: 'textarea',
            placeholder: 'Cuéntales a otros qué tiene de especial esta ruta...'
          }
        ],
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Publicar',
            handler: (data) => {
              this.enviarPublicacion(ruta.id, ruta.titulo, data.contenido);
            }
          }
        ]
      });
      await alert.present();
    });
  }

  private enviarPublicacion(rutaId: number, titulo: string, contenido: string) {
    console.log("Publicando con UserID:", this.userIdActual);
    
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
        // Forzamos a Angular a mostrar el Toast de éxito y refrescar de inmediato
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

  // Método para confirmar la eliminación de una publicación
  async confirmarQuitarPublicacion(ruta: any) {
    this.zone.run(async () => {
      const alert = await this.alertCtrl.create({
        header: 'Retirar del foro',
        message: '¿Seguro que quieres quitar esta ruta de la sección de la comunidad?',
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Quitar',
            role: 'destructive',
            handler: () => { this.quitarPublicacion(ruta.id); }
          }
        ]
      });
      await alert.present();
    });
  }

  private quitarPublicacion(rutaId: number) {
    // CAMBIO AQUÍ: Llamamos a eliminarPublicacionPorRuta en lugar de eliminarPublicacion
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
          
          // Refrescamos los datos locales para cambiar el estado de los botones
          this.cargarMisRutas();
        });
      },
      error: (err) => console.error("Error al retirar la publicación", err)
    });
  }


}