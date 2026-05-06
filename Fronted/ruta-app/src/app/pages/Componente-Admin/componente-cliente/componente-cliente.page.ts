import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { RouterModule, Router } from '@angular/router';
import { IonicModule, ToastController } from "@ionic/angular"; // Añadimos ToastController

import { addIcons } from 'ionicons';
import { addOutline, createOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-componente-cliente',
  templateUrl: './componente-cliente.page.html',
  styleUrls: ['./componente-cliente.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonicModule]
})
export class ComponenteClientePage implements OnInit {
  clientes: any[] = [];

  constructor(
    private adminService: AdminService,
    private router: Router,
    private toastController: ToastController // Inyectamos el controlador de avisos
  ) {
    addIcons({ addOutline, createOutline, trashOutline });
  }

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.adminService.getClientes().subscribe(res => {
      this.clientes = res;
    });
  }

  // Función para mostrar el mensaje de éxito
  async mostrarMensaje(mensaje: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom',
      color: color
    });
    await toast.present();
  }

  async eliminarcliente(id: number) {
    if (!id) return;

    // IMPORTANTE: Si el error persiste, en el servicio admin.service.ts 
    // podrías añadir { responseType: 'text' } en el delete.
    this.adminService.eliminarCliente(id).subscribe({
      next: () => {
        // Éxito normal
        this.procesarEliminacionLocal(id);
      },
      error: (err) => {
        // Si el error es solo de formato (Status 200) pero el borrado fue real
        if (err.status === 200) {
          this.procesarEliminacionLocal(id);
        } else {
          console.error("Error real del servidor:", err);
          this.mostrarMensaje("No se pudo eliminar el cliente", "danger");
        }
      }
    });
  }

  // Lógica para limpiar la lista y avisar al usuario
  procesarEliminacionLocal(id: number) {
    this.clientes = this.clientes.filter(c => c.idCliente !== id);
    this.mostrarMensaje("Usuario eliminado correctamente");
    console.log("Cliente borrado con éxito");
  }

  nuevocliente() {
    this.router.navigate(['/componente-panel-admin/clientes/nuevo']);
  }

  editarcliente(id: number) {
    this.router.navigate(['/componente-panel-admin/clientes/editar', id]);
  }
}