import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicacionesService } from '../../../services/publicaciones.service';
import { ComentariosService } from '../../../services/comentarios.service';
import { ModalController, IonItem, IonLabel } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonCard, 
  IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, 
  IonButton, IonIcon, IonBadge, AlertController, ToastController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline, chatbubblesOutline, personOutline, timeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-componente-publicaciones',
  templateUrl: './componente-publicaciones.page.html',
  styleUrls: ['./componente-publicaciones.page.scss'],
  standalone: true,
  imports: [IonLabel, IonItem, 
    IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonCard, 
    IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, 
    IonButton, IonIcon, IonBadge, CommonModule, FormsModule
  ]
})
export class ComponentePublicacionesPage implements OnInit {
  listaPublicaciones: any[] = [];

  constructor(
    private publicacionesService: PublicacionesService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private comentariosService: ComentariosService
  ) { 
    addIcons({ trashOutline, chatbubblesOutline, personOutline, timeOutline });
  }

  ngOnInit() {
    this.cargarPublicaciones();
  }

  cargarPublicaciones() {
    this.publicacionesService.listarTodas().subscribe({
      next: (data) => {
        this.listaPublicaciones = data;
        console.log("Publicaciones recibidas:", data);
      },
      error: (err) => console.error("Error al obtener el foro", err)
    });
  }

  async confirmarEliminar(id: number) {
    const alert = await this.alertCtrl.create({
      header: '¿Eliminar Publicación?',
      message: 'Se borrará la publicación y todos sus comentarios asociados de forma permanente.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => { this.eliminar(id); }
        }
      ]
    });
    await alert.present();
  }

  eliminar(id: number) {
    this.publicacionesService.eliminarPublicacion(id).subscribe({
      next: async () => {
        this.listaPublicaciones = this.listaPublicaciones.filter(p => p.id !== id);
        const toast = await this.toastCtrl.create({
          message: 'Publicación eliminada correctamente',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      },
      error: (err) => console.error("Error al eliminar publicación", err)
    });
  }


  //Comentarios

  async verComentarios(publicacionId: number) {
  // Buscamos la publicación en nuestra lista local
  const pub = this.listaPublicaciones.find(p => p.id === publicacionId);

  if (pub.mostrarComentariosAdmin) {
    pub.mostrarComentariosAdmin = false;
    return;
  }

  this.comentariosService.listarPorPublicacion(publicacionId).subscribe({
    next: (comentarios) => {
      pub.listaComentariosCargados = comentarios;
      pub.mostrarComentariosAdmin = true;
    },
    error: (err) => console.error("Error al cargar comentarios", err)
  });
}

  async eliminarComentario(comentarioId: number, publicacionId: number) {
    this.comentariosService.eliminarComentario(comentarioId).subscribe({
      next: () => {
        const pub = this.listaPublicaciones.find(p => p.id === publicacionId);
        if (pub && pub.listaComentariosCargados) {
          pub.listaComentariosCargados = pub.listaComentariosCargados.filter((c: any) => c.id !== comentarioId);
          
          if (pub.comentarios) {
            pub.comentarios.length--;
          }
        }
        
        this.mostrarToast('Comentario eliminado', 'danger');
      }
    });
  }

  // Función auxiliar para mensajes
  async mostrarToast(msj: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: msj,
      duration: 2000,
      color: color
    });
    await toast.present();
  }

}