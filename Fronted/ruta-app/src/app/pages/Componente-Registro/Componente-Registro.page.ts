import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { GeoService } from '../../services/geo.service';
import { AdminService } from '../../services/admin.service'; // Usaremos esto para validar duplicados
import { Provincia, Municipio } from '../../interfaces/geo.interface';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { validaciones } from '../../Validators/validaciones';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './Componente-Registro.page.html',
  styleUrls: ['./Componente-Registro.page.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule, IonicModule, ReactiveFormsModule]
})
export class RegistroPage implements OnInit {

  provincias: Provincia[] = [];
  municipios: Municipio[] = [];
  registroUsuario!: FormGroup;

  constructor(
    private geoService: GeoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registroUsuario = new FormGroup({
      email: new FormControl('', [Validators.required, validaciones.email]),
      password: new FormControl('', [Validators.required, validaciones.contrasena]),
      dni: new FormControl('', [Validators.required, validaciones.dni]),
      nombre: new FormControl('', [Validators.required, validaciones.soloTexto]),
      apellido1: new FormControl('', [Validators.required, validaciones.soloTexto]),
      apellido2: new FormControl('', [validaciones.soloTexto]),
      telefono: new FormControl('', [Validators.required, validaciones.telefono]),
      provincia: new FormControl('', Validators.required),
      localidad: new FormControl('', Validators.required)
    });

    // 1. Cargar Provincias
    this.geoService.getProvincias().subscribe(res => {
      this.provincias = res.data || res;
    });

    // 2. Cargar listas para validaciones de repetidos
    this.cargarValidacionesDuplicados();
  }

  // registro.ts

cargarValidacionesDuplicados() {
  
  this.registroUsuario.get('email')?.valueChanges.subscribe(email => {
    if (this.registroUsuario.get('email')?.valid) {
      this.authService.checkEmail(email).subscribe(exists => {
        if (exists) {
          this.registroUsuario.get('email')?.setErrors({ emailDuplicado: true });
        }
      });
    }
  });

  this.registroUsuario.get('dni')?.valueChanges.subscribe(dni => {
    if (this.registroUsuario.get('dni')?.valid) {
      this.authService.checkDni(dni).subscribe(exists => {
        if (exists) {
          this.registroUsuario.get('dni')?.setErrors({ dniDuplicado: true });
        }
      });
    }
  });
}

  onProvinciaChangeNative(event: any) {
  const codProvincia = event.target.value; // En select nativo es target.value
  this.municipios = [];
  this.registroUsuario.get('localidad')?.setValue('');

  if (codProvincia) {
    this.geoService.getMunicipios(codProvincia).subscribe(res => {
      this.municipios = res.data || res;
    });
  }
}

  guardar() {
    if (this.registroUsuario.invalid) return;

    const datosForm = this.registroUsuario.value;
    
    // Mapear código de provincia a nombre real
    const provinciaObj = this.provincias.find(p => p.CPRO === datosForm.provincia);
    
    const datosFinales = {
      ...datosForm,
      provincia: provinciaObj ? (provinciaObj.PRO || (provinciaObj as any).NOMBRE_PROVINCIA) : datosForm.provincia,
      rolId: 2 // Por defecto rol cliente
    };

    this.authService.registro(datosFinales).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('rol', res.rol);
        this.router.navigate(['/landing']);
      },
      error: (err) => alert("Error en el registro: " + (err.error?.message || "Servidor no disponible"))
    });
  }
}