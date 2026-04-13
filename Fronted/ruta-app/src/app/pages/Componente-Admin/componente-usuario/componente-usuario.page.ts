import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-componente-usuario',
  templateUrl: './componente-usuario.page.html',
  styleUrls: ['./componente-usuario.page.scss'],
  standalone: true,
  imports: [IonButton, CommonModule, FormsModule]
})
export class ComponenteUsuarioPage implements OnInit {

  usuarios: any[] = [];
  clientes: any[] = [];



  constructor(
    private adminService: AdminService) {}

  // Inicializar
  ngOnInit() {
    this.cargarUsuarios();
  }

  // Usuarios

  cargarUsuarios() {
    this.adminService.getUsuarios().subscribe(res => {
      this.usuarios = res;
    });
  }

  eliminaruser(id: number) {
    this.adminService.eliminarUsuario(id).subscribe(() => {
      this.cargarUsuarios();
    });
  }
 

}
