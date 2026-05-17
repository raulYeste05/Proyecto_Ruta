import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';import { IonicModule } from '@ionic/angular';
import { ClienteService } from '../../../services/cliente.service';
import { GeoService } from '../../../services/geo.service';
import { validaciones } from '../../../Validators/validaciones';
import { Router } from '@angular/router';

@Component({
  selector: 'app-componente-perfil',
  templateUrl: './componente-perfil.component.html',
  styleUrls: ['./componente-perfil.component.scss'],
  standalone: true,
  imports : [CommonModule, IonicModule, ReactiveFormsModule]
})
export class ComponentePerfilPage implements OnInit {
  perfilForm: FormGroup;
  provincias: any[] = [];
  localidades: any[] = [];
  id_cliente_actual: number | null = null;
  clienteOriginal: any;


 constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private geoService: GeoService,
    private router: Router
  ) {
    this.perfilForm = this.fb.group({
      password: ['', (control: AbstractControl) => {
        if (!control.value || control.value.trim() === '') {
          return null; 
        }
        return validaciones.contrasena(control); 
      }],
      dni: ['', [Validators.required, validaciones.dni]],
      nombre: ['', [Validators.required, validaciones.soloTexto]],
      apellido1: ['', [Validators.required, validaciones.soloTexto]],
      apellido2: ['', [validaciones.soloTexto]],
      telefono: ['', [Validators.required, validaciones.telefono]],
      provincia: ['', Validators.required],
      localidad: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Primero cargamos provincias, luego el perfil
    this.geoService.getProvincias().subscribe(data => {
      this.provincias = Array.isArray(data) ? data : data.data;
      this.cargarPerfil();
    });
  }

  cargarPerfil() {
  this.clienteService.getPerfil().subscribe({
    next: (data) => {
      console.log('Datos recibidos del perfil:', data); 
      this.clienteOriginal = data;
      
      this.id_cliente_actual = data.id_cliente || data.idCliente; 

      const provEncontrada = this.provincias.find(p => 
        (p.PRO || p.NOMBRE_PROVINCIA) === data.provincia
      );
      const codProv = provEncontrada ? provEncontrada.CPRO : '';

      this.perfilForm.patchValue({
        dni: data.dni,
        nombre: data.nombre,
        apellido1: data.apellido1,
        apellido2: data.apellido2,
        telefono: data.telefono,
        provincia: codProv,
        localidad: data.localidad
      });

      if (codProv) {
        this.cargarMunicipios(codProv);
      }
    },
    error: (err) => console.error('Error al cargar perfil', err)
  });
}

  onProvinciaChangeNative(event: any) {
    const codProv = event.target.value; 
    
    // Limpiamos localidad al cambiar provincia
    this.perfilForm.get('localidad')?.setValue('');
    this.localidades = [];

    if (codProv) {
      this.cargarMunicipios(codProv);
    }
  }

  cargarMunicipios(codProv: string) {
    this.geoService.getMunicipios(codProv).subscribe(res => {
      this.localidades = Array.isArray(res) ? res : (res.data || []);
    });
  }

  guardarCambios() {
    if (this.perfilForm.invalid) return;

  const values = this.perfilForm.value;
  const provSeleccionada = this.provincias.find(p => p.CPRO === values.provincia);


    const clienteEditado: any = {
      id_cliente: this.id_cliente_actual, 
      dni: values.dni,
      nombre: values.nombre,
      apellido1: values.apellido1,
      apellido2: values.apellido2,
      telefono: values.telefono,
      provincia: provSeleccionada ? (provSeleccionada.PRO || provSeleccionada.NOMBRE_PROVINCIA) : values.provincia,
      localidad: values.localidad,
      user_id: this.clienteOriginal?.userId || this.clienteOriginal?.user_id // Mantenemos el usuario vinculado
    };

   
    if (values.password && values.password.trim() !== '') {
      clienteEditado.password = values.password;
      console.log("Se detectó cambio de contraseña");
    }

    console.log('Enviando al servidor:', clienteEditado);

    if (this.id_cliente_actual) {
      this.clienteService.actualizarPerfil(this.id_cliente_actual, clienteEditado).subscribe({
        next: (res) => {
          console.log('Respuesta servidor:', res);
          alert('¡Perfil actualizado con éxito!');
        },
        error: (err) => {
          console.error('Error en la petición PUT:', err);
          alert('Hubo un error al guardar los cambios.');
        }
      });
    } else {
      console.error('No tenemos el ID del cliente cargado.');
    }
  }

  irAMisRutas() {
    this.router.navigate(['/componente-panel-cliente/resumen-rutas']);
  }
}