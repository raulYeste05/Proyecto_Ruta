import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';import { IonicModule } from '@ionic/angular';
import { ClienteService } from '../../../services/cliente.service';
import { GeoService } from '../../../services/geo.service';
import { ComponenteResumenRutas } from '../componente-resumen-rutas/componente-resumen-rutas.component';
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
      // CAMBIO AQUÍ: Añadimos explícitamente el tipo ': AbstractControl'
      password: ['', (control: AbstractControl) => {
        if (!control.value || control.value.trim() === '') {
          return null; // Si está vacío es totalmente válido
        }
        return validaciones.contrasena(control); // Si tiene texto, aplica tu regla
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
    // 1. Primero cargamos provincias, luego el perfil
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

        // 1. Rellenamos los datos básicos primero
        this.perfilForm.patchValue({
          dni: data.dni,
          nombre: data.nombre,
          apellido1: data.apellido1,
          apellido2: data.apellido2,
          telefono: data.telefono,
          provincia: codProv
        });

        // 2. Si hay provincia, cargamos municipios y le pasamos la localidad para que se seleccione correctamente
        if (codProv) {
          this.cargarMunicipios(codProv, data.localidad);
        }
      },
      error: (err) => console.error('Error al cargar perfil', err)
    });
  }

  // CAMBIO AQUÍ: Añadimos 'localidadSeleccionada' como parámetro opcional
  cargarMunicipios(codProv: string, localidadSeleccionada?: string) {
    this.geoService.getMunicipios(codProv).subscribe(res => {
      this.localidades = Array.isArray(res) ? res : (res.data || []);
      
      // Si venimos de cargar el perfil, le metemos el valor de la localidad guardada ahora que ya existe la lista
      if (localidadSeleccionada) {
        this.perfilForm.patchValue({
          localidad: localidadSeleccionada
        });
        
        // Forzamos a Angular a comprobar todo el formulario y marcarlo como VÁLIDO
        this.perfilForm.updateValueAndValidity();
      }
    });
  }

  onProvinciaChangeNative(event: any) {
    const codProv = event.target.value; // Importante: en nativo usamos event.target.value
    
    // Limpiamos localidad al cambiar provincia
    this.perfilForm.get('localidad')?.setValue('');
    this.localidades = [];

    if (codProv) {
      this.cargarMunicipios(codProv);
    }
  }



  guardarCambios() {

    console.log(this.perfilForm);

  if (this.perfilForm.invalid) {
    console.log(this.perfilForm.errors);
    console.log(this.perfilForm.get('dni')?.errors);
    console.log(this.perfilForm.get('nombre')?.errors);
    console.log(this.perfilForm.get('apellido1')?.errors);
    console.log(this.perfilForm.get('apellido2')?.errors);
    console.log(this.perfilForm.get('telefono')?.errors);
    console.log(this.perfilForm.get('provincia')?.errors);
    console.log(this.perfilForm.get('localidad')?.errors);
    console.log(this.perfilForm.get('password')?.errors);

    return;
  }
  
    if (this.perfilForm.invalid) return;
    

  const values = this.perfilForm.value;
  const provSeleccionada = this.provincias.find(p => p.CPRO === values.provincia);

    // Mapeamos el objeto para que el Backend lo reciba perfecto
    // Importante: Usamos los nombres de campos que espera tu Entity de Java
    const clienteEditado: any = {
      id_cliente: this.id_cliente_actual, // ID clave para el UPDATE
      dni: values.dni,
      nombre: values.nombre,
      apellido1: values.apellido1,
      apellido2: values.apellido2,
      telefono: values.telefono,
      provincia: provSeleccionada ? (provSeleccionada.PRO || provSeleccionada.NOMBRE_PROVINCIA) : values.provincia,
      localidad: values.localidad,
      user_id: this.clienteOriginal?.userId || this.clienteOriginal?.user_id // Mantenemos el usuario vinculado
    };

    // Agregamos la contraseña si es que se ha cambiado
    // SOLO añadimos la contraseña si el usuario ha escrito algo
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