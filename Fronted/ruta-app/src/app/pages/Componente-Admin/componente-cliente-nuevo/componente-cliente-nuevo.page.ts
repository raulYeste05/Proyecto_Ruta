import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importamos ReactiveFormsModule en lugar de FormsModule (o ambos)
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { Router, RouterModule } from '@angular/router';
import { IonContent, IonButton, IonItem, IonLabel, IonText } from '@ionic/angular/standalone';
import { validaciones } from '../../../Validators/validaciones';

@Component({
  selector: 'app-componente-cliente-nuevo',
  templateUrl: './componente-cliente-nuevo.page.html',
  styleUrls: ['./componente-cliente-nuevo.page.scss'],
  standalone: true,
  imports: [IonLabel, IonItem, IonButton, IonContent, IonText, CommonModule, ReactiveFormsModule, RouterModule]
})
export class ComponenteClienteNuevoPage implements OnInit {
  
  fg: FormGroup; // El grupo de formulario
  provincias: any[] = [];
  localidades: any[] = [];
  
  usuariosActuales: any[] = [];
  clientesActuales: any[] = [];

  constructor(
    private fb: FormBuilder, 
    private adminService: AdminService, 
    private router: Router
  ) {
    // Inicializamos el formulario con las validaciones
    this.fg = this.fb.group({
      email: ['', [Validators.required, validaciones.email, ]],
      password: ['', [Validators.required, validaciones.contrasena]],
      dni: ['', [Validators.required, validaciones.dni]],
      nombre: ['', [Validators.required, validaciones.soloTexto]],
      apellido1: ['', [Validators.required, validaciones.soloTexto]],
      apellido2: ['', [validaciones.soloTexto]],
      telefono: ['', [Validators.required, validaciones.telefono]],
      provincia: ['', [Validators.required]],
      localidad: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.cargarDatosYValidar();
    
    this.adminService.getProvincias().subscribe(res => {
      this.provincias = Array.isArray(res) ? res : res.data;
    });
  }

  cargarDatosYValidar() {
    // 1. Obtenemos usuarios para validar el EMAIL repetido
    this.adminService.getUsuarios().subscribe(users => {
      this.usuariosActuales = users;
      // Añadimos el validador de repetidos dinámicamente
      this.fg.get('email')?.addValidators(validaciones.emailRepetido(this.usuariosActuales, 'email'));
      this.fg.get('email')?.updateValueAndValidity();
    });

    // 2. Obtenemos clientes para validar el DNI repetido
    this.adminService.getClientes().subscribe(clientes => {
      this.clientesActuales = clientes;
      // Añadimos el validador de DNI repetido
      this.fg.get('dni')?.addValidators(validaciones.dniRepetido(this.clientesActuales));
      this.fg.get('dni')?.updateValueAndValidity();
    });
  }

  onProvinciaChange() {
    const codProv = this.fg.get('provincia')?.value;
    this.localidades = [];
    this.fg.get('localidad')?.setValue('');
    
    this.adminService.getLocalidades(codProv).subscribe(res => {
      this.localidades = Array.isArray(res) ? res : res.data;
    });
  }

  guardar() {
    if (this.fg.invalid) {
      this.fg.markAllAsTouched(); // Marca todos para mostrar errores
      return;
    }

    const formValues = this.fg.value;
    const provNombre = this.provincias.find(p => p.CPRO === formValues.provincia);

    const datosRegistro = {
      ...formValues,
      provincia: provNombre ? (provNombre.PRO || provNombre.NOMBRE_PROVINCIA) : formValues.provincia,
      rolId: 2
    };

    this.adminService.nuevoCliente(datosRegistro).subscribe({
      next: () => this.router.navigate(['/componente-panel-admin/clientes']),
      error: (err) => alert("Error: " + err.error.message)
    });
  }
}