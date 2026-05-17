import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ComentariosService } from '../../../services/comentarios.service';
import { AuthService } from '../../../services/auth.service';
import { addIcons } from 'ionicons';
import { send } from 'ionicons/icons';

@Component({
  selector: 'app-componente-comentarios',
  templateUrl: './componente-comentarios.component.html',
  styleUrls: ['./componente-comentarios.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class ComponenteComentariosComponent  implements OnInit {
  @Input() publicacionId!: any;
  comentarios: any[] = [];
  nuevoComentario: string = '';
  userId!: number;

  constructor(
    private comentariosService: ComentariosService,
    private authService: AuthService,
    private modalCtrl: ModalController
  ) { 
    addIcons({send});
  }

  ngOnInit() {
    this.cargarComentarios();
  }

  // Método para cargar los comentarios de una publicación
  cargarComentarios() {
    this.comentariosService.listarPorPublicacion(this.publicacionId).subscribe(data => {
      this.comentarios = data;
    });
  }

  // Método para enviar un comentario
    enviarComentario() {
    // Obtenemos el ID real desde el token
    const userIdReal = this.authService.getUserId();

    if (!userIdReal === null || userIdReal === undefined) {
      console.error("No se pudo identificar al usuario.");
      return;
    }

    const body = {
      publicacionId: this.publicacionId,
      userId: userIdReal, 
      contenido: this.nuevoComentario
    };

    this.comentariosService.crearComentario(body).subscribe({
      next: (res) => {
        this.comentarios = [...this.comentarios, res];
        this.nuevoComentario = '';
      },
      error: (err) => console.error("Error al enviar comentario", err)
    });
  }

  cerrar() {
    this.modalCtrl.dismiss({ actualizado: true });
  }
}
