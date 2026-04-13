import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonContent, IonButton, IonItem, IonLabel, IonText } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { validaciones } from '../../../Validators/validaciones';

@Component({
  selector: 'app-componente-cliente-editar',
  templateUrl: './componente-cliente-editar.page.html',
  styleUrls: ['./componente-cliente-editar.page.scss'],
  standalone: true,
  imports: [IonLabel, IonItem, IonButton, IonContent, IonText, CommonModule, ReactiveFormsModule]
})
export class ComponenteClienteEditarPage implements OnInit {

  fg: FormGroup;
  provincias: any[] = [];
  localidades: any[] = [];
  clienteOriginal: any; // Para guardar datos originales si es necesario

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private router: Router
  ) {
    // Inicializar el formulario con validaciones básicas
    this.fg = this.fb.group({
      email: ['', [Validators.required, validaciones.email]],
      password: ['', [validaciones.contrasena]],
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
    const id = this.route.snapshot.paramMap.get('id');

    // 1. Cargar Provincias
    this.adminService.getProvincias().subscribe(res => {
      this.provincias = Array.isArray(res) ? res : res.data;

      // 2. Cargar Cliente
      this.adminService.getClientes().subscribe(clientes => {
        const clienteEncontrado = clientes.find(c => c.idCliente == id);
        
        if (clienteEncontrado) {
          this.clienteOriginal = clienteEncontrado;
          
          // 3. Obtener listas para validaciones de duplicados (excluyendo al actual)
          this.adminService.getUsuarios().subscribe(users => {
            const otrosUsuarios = users.filter(u => u.idUser !== clienteEncontrado.userId);
            this.fg.get('email')?.addValidators(validaciones.emailRepetido(otrosUsuarios, 'email'));
          });

          this.adminService.getClientes().subscribe(clientes => {
            const otrosClientes = clientes.filter(c => c.idCliente !== clienteEncontrado.idCliente);
            this.fg.get('dni')?.addValidators(validaciones.dniRepetido(otrosClientes));
          });


          // 4. Rellenar el formulario
          this.rellenarFormulario(clienteEncontrado);
        }
      });
    });
  }

  rellenarFormulario(cliente: any) {
    // Buscar el código de la provincia por nombre
    const provEncontrada = this.provincias.find(p => (p.PRO || p.NOMBRE_PROVINCIA) === cliente.provincia);
    const codProvincia = provEncontrada ? provEncontrada.CPRO : '';

    this.fg.patchValue({
      email: cliente.email,
      dni: cliente.dni,
      nombre: cliente.nombre,
      apellido1: cliente.apellido1,
      apellido2: cliente.apellido2,
      telefono: cliente.telefono,
      provincia: codProvincia,
      localidad: cliente.localidad
    });

    if (codProvincia) {
      this.cargarLocalidades(codProvincia);
    }
  }

  cargarLocalidades(codProvincia: string) {
    if (!codProvincia) return;
    this.adminService.getLocalidades(codProvincia).subscribe(res => {
      this.localidades = res.data || res;
    });
  }

  onProvinciaChange() {
    const codProv = this.fg.get('provincia')?.value;
    this.fg.get('localidad')?.setValue('');
    this.cargarLocalidades(codProv);
  }

  guardar() {
    if (this.fg.invalid) return;

    const values = this.fg.value;
    const provNombre = this.provincias.find(p => p.CPRO === values.provincia);

    const clienteFormateado = {
      id_cliente: this.clienteOriginal.idCliente,
      dni: values.dni,
      password : values.password,
      nombre: values.nombre,
      apellido1: values.apellido1,
      apellido2: values.apellido2,
      provincia: provNombre ? (provNombre.PRO || provNombre.NOMBRE_PROVINCIA) : values.provincia,
      localidad: values.localidad,
      user_id: this.clienteOriginal.userId,
      telefono: values.telefono
    };

    //  Solo añadimos el password si el campo tiene contenido
    if (values.password && values.password.trim() !== '') {
      clienteFormateado.password = values.password;
    }

    this.adminService.editarCliente(this.clienteOriginal.idCliente, clienteFormateado).subscribe({
      next: () => this.router.navigate(['/componente-panel-admin/clientes']),
      error: (err) => console.error(err)
    });
  }
}