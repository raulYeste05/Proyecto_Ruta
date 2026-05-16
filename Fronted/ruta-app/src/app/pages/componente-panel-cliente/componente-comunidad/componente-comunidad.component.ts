import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ComentariosService } from '../../../services/comentarios.service';
import { PublicacionesService } from '../../../services/publicaciones.service';
import { ModalController } from '@ionic/angular/standalone';
import { ComponenteComentariosComponent } from '../componente-comentarios/componente-comentarios.component';
import { Router } from '@angular/router';

import { addIcons } from 'ionicons';
import { chatbubblesOutline, mapOutline, trailSignOutline } from 'ionicons/icons';

@Component({
  selector: 'app-componente-comunidad',
  templateUrl: './componente-comunidad.component.html',
  styleUrls: ['./componente-comunidad.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ComponenteComunidad implements OnInit {
  publicaciones: any[] = [];
  contadoresComentarios: { [key: number]: number} = {};

  constructor(
    private pubService: PublicacionesService,
    private comentariosService: ComentariosService,
    private router: Router,
    private modalCtrl: ModalController
  ) {
    addIcons({chatbubblesOutline, mapOutline, trailSignOutline});
  }

  ngOnInit() {
    this.cargarPublicaciones();
  }

  // NUEVO: Este método se ejecuta CADA VEZ que la pantalla de la comunidad se pone en primer plano
  ionViewWillEnter() {
    this.cargarPublicaciones();
  }

  cargarPublicaciones() {
    this.pubService.listarTodas().subscribe({
      next: (data) => {
        this.publicaciones = data.reverse();
        this.publicaciones.forEach(post => {
          this.obtenerConteo(post.id);
        });
      }
    });
  }

  obtenerConteo(id: number) {
    this.comentariosService.contarComentarios(id).subscribe(total => {
      this.contadoresComentarios[id] = total;
    });
  }

  doRefresh(event: any) {
    this.pubService.listarTodas().subscribe({
      next: (data) => {
        this.publicaciones = data.reverse();
        event.target.complete();
      }
    });
  }

  verDetalleRuta(rutaId: number) {
    this.router.navigate(['/componente-panel-cliente/mapa'], { queryParams: { idRuta: rutaId } });
  }

  async abrirComentarios(publicacionId: number) {
    const modal = await this.modalCtrl.create({
      component: ComponenteComentariosComponent,
      componentProps: { publicacionId: publicacionId },
      initialBreakpoint: 0.75,
      breakpoints: [0, 0.5, 0.75, 1]
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.actualizado) {
      this.obtenerConteo(publicacionId);
    }
  }
}