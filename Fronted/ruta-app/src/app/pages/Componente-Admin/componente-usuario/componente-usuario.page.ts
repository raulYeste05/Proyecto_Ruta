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
    if (!id) return;

    // Añadimos { responseType: 'text' } si el servidor no devuelve un JSON
    this.adminService.eliminarUsuario(id).subscribe({
      next: () => {
        console.log("Usuario eliminado con éxito");
        // ESTO ES CLAVE: Filtramos la lista localmente para que desaparezca al instante
        this.usuarios = this.usuarios.filter(u => u.idUser !== id);
      },
      error: (err) => {
        // Si el status es 200, en realidad es un éxito, así que lo manejamos aquí
        if (err.status === 200) {
          this.usuarios = this.usuarios.filter(u => u.idUser !== id);
        } else {
          console.error("Error real al eliminar:", err);
        }
      }
    });
  }
 

}
