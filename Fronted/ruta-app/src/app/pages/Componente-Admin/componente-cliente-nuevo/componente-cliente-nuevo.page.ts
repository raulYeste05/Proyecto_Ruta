import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { Router, RouterModule } from '@angular/router';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { validaciones } from '../../../Validators/validaciones';

@Component({
  selector: 'app-componente-cliente-nuevo',
  templateUrl: './componente-cliente-nuevo.page.html',
  styleUrls: ['./componente-cliente-nuevo.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, CommonModule, ReactiveFormsModule, RouterModule]
})
export class ComponenteClienteNuevoPage implements OnInit {
  
  fg: FormGroup;
  provincias: any[] = [];
  localidades: any[] = [];
  
  usuariosActuales: any[] = [];
  clientesActuales: any[] = [];

  constructor(
    private fb: FormBuilder, 
    private adminService: AdminService, 
    private router: Router
  ) {
    this.fg = this.fb.group({
      email: ['', [Validators.required, validaciones.email]],
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
    // Obtenemos usuarios para validar el EMAIL repetido
    this.adminService.getUsuarios().subscribe({
      next: (users) => {
        this.usuariosActuales = users;
        this.fg.get('email')?.addValidators(validaciones.emailRepetido(this.usuariosActuales, 'email'));
        this.fg.get('email')?.updateValueAndValidity({ emitEvent: false });
      }
    });

    // Obtenemos clientes para validar el DNI repetido
    this.adminService.getClientes().subscribe({
      next: (clientes) => {
        this.clientesActuales = clientes;
        this.fg.get('dni')?.addValidators(validaciones.dniRepetido(this.clientesActuales));
        this.fg.get('dni')?.updateValueAndValidity({ emitEvent: false });
      }
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
      this.fg.markAllAsTouched();
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
      error: (err) => alert("Error: " + (err.error?.message || "No se pudo crear el cliente"))
    });
  }
}