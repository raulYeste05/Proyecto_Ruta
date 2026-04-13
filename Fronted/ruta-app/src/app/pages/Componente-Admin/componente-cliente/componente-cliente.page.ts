import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { RouterModule, Router } from '@angular/router';
import { IonButton, IonItem, IonInput } from '@ionic/angular/standalone';
import { IonicModule } from "@ionic/angular";;

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
    private router: Router) {}

  // Inicializar
  ngOnInit() {
    this.cargarClientes();
  }

  // Clientes

  cargarClientes() {
    this.adminService.getClientes().subscribe(res => {
      this.clientes = res;
    });
  }

  nuevocliente() {
    this.router.navigate(['/componente-panel-admin/clientes/nuevo'] );
  }

  eliminarcliente(id: number) {
    this.adminService.eliminarCliente(id).subscribe(() => {
      this.cargarClientes();
    });
  }

  editarcliente(id: number) {
    this.router.navigate(['/componente-panel-admin/clientes/editar', id] );
  }

}
