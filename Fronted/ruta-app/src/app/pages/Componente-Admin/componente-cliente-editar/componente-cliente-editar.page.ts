import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { validaciones } from '../../../Validators/validaciones';

@Component({
  selector: 'app-componente-cliente-editar',
  templateUrl: './componente-cliente-editar.page.html',
  styleUrls: ['./componente-cliente-editar.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, CommonModule, ReactiveFormsModule]
})
export class ComponenteClienteEditarPage implements OnInit {

  fg: FormGroup;
  provincias: any[] = [];
  localidades: any[] = [];
  clienteOriginal: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private router: Router
  ) {
   
    this.fg = this.fb.group({
      email: ['', [Validators.required, validaciones.email]],
      password: [''], // Opcional al editar
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

    // Cargar Provincias Primero
    this.adminService.getProvincias().subscribe(resProvincias => {
      this.provincias = Array.isArray(resProvincias) ? resProvincias : resProvincias.data;

      // Cargar datos del Cliente
      this.adminService.getClientes().subscribe(clientes => {
        const clienteEncontrado = clientes.find(c => c.idCliente == id);
        
        if (clienteEncontrado) {
          this.clienteOriginal = clienteEncontrado;
          
          // Rellenar el formulario ANTES de poner los validadores de duplicados
          this.rellenarFormulario(clienteEncontrado);

          // Añadir validadores de duplicados EXCLUYENDO al usuario actual
          this.adminService.getUsuarios().subscribe(users => {
            const otrosUsuarios = users.filter(u => u.idUser !== clienteEncontrado.userId);
            this.fg.get('email')?.addValidators(validaciones.emailRepetido(otrosUsuarios, 'email'));
            this.fg.get('email')?.updateValueAndValidity(); // Forzar a Angular a revisar
          });

          this.adminService.getClientes().subscribe(todosClientes => {
            const otrosClientes = todosClientes.filter(c => c.idCliente !== clienteEncontrado.idCliente);
            this.fg.get('dni')?.addValidators(validaciones.dniRepetido(otrosClientes));
            this.fg.get('dni')?.updateValueAndValidity(); // Forzar a Angular a revisar
          });
        }
      });
    });
  }

  rellenarFormulario(cliente: any) {
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
      // Cargamos las localidades correspondientes a la provincia del cliente
      this.adminService.getLocalidades(codProvincia).subscribe(res => {
        this.localidades = res.data || res;
        // Volvemos a setear la localidad para asegurarnos que se marque en el <select>
        this.fg.get('localidad')?.setValue(cliente.localidad);
      });
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

    const clienteFormateado: any = {
      id_cliente: this.clienteOriginal.idCliente,
      dni: values.dni,
      nombre: values.nombre,
      apellido1: values.apellido1,
      apellido2: values.apellido2,
      provincia: provNombre ? (provNombre.PRO || provNombre.NOMBRE_PROVINCIA) : values.provincia,
      localidad: values.localidad,
      user_id: this.clienteOriginal.userId,
      telefono: values.telefono
    };

    if (values.password && values.password.trim() !== '') {
      clienteFormateado.password = values.password;
    }

    this.adminService.editarCliente(this.clienteOriginal.idCliente, clienteFormateado).subscribe({
      next: () => this.router.navigate(['/componente-panel-admin/clientes']),
      error: (err) => console.error(err)
    });
  }
}