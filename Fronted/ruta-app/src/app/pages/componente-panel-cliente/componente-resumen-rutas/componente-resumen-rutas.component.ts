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


  // Variables de control para las alertas del HTML
  isAlertEliminarOpen = false;
  isAlertPublicarOpen = false;
  isAlertQuitarOpen = false;
  rutaSeleccionada: any = null;

  // Configuración de botones de acción
  alertEliminarButtons = [
    { text: 'Cancelar', role: 'cancel' },
    {
      text: 'Eliminar',
      role: 'destructive',
      handler: () => { 
        if (this.rutaSeleccionada) this.eliminarRuta(this.rutaSeleccionada.id); 
      }
    }
  ];

  alertPublicarButtons = [
    { text: 'Cancelar', role: 'cancel' },
    {
      text: 'Publicar',
      handler: (data: any) => { 
        if (this.rutaSeleccionada) {
          this.enviarPublicacion(this.rutaSeleccionada.id, this.rutaSeleccionada.titulo, data.contenido); 
        }
      }
    }
  ];

  alertQuitarButtons = [
    { text: 'Cancelar', role: 'cancel' },
    {
      text: 'Quitar',
      role: 'destructive',
      handler: () => { 
        if (this.rutaSeleccionada) this.quitarPublicacion(this.rutaSeleccionada.id); 
      }
    }
  ];


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
  // Método para confirmar la eliminación de una ruta
  // MÉTODOS DE CORRECCIÓN: Ahora solo activan los toggles del HTML
  confirmarEliminar(id: number) {
    this.rutaSeleccionada = { id };
    this.isAlertEliminarOpen = true;
  }

  async publicarRuta(ruta: any) {
    this.rutaSeleccionada = ruta;
    this.isAlertPublicarOpen = true;
  }

  async confirmarQuitarPublicacion(ruta: any) {
    this.rutaSeleccionada = ruta;
    this.isAlertQuitarOpen = true;
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