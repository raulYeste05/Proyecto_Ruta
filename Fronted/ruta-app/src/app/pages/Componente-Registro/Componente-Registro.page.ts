import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { GeoService } from '../../services/geo.service';
import { AdminService } from '../../services/admin.service'; 
import { Provincia, Municipio } from '../../interfaces/geo.interface';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ToastController } from '@ionic/angular/standalone'; // Importación nativa corregida
import { validaciones } from '../../Validators/validaciones';
import { AuthService } from '../../services/auth.service';

import { addIcons } from 'ionicons';
import { alertCircleOutline, mailOutline, lockClosedOutline, callOutline, locationOutline, mapOutline } from 'ionicons/icons';

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
    private router: Router,
    private toastCtrl: ToastController // Inyectamos el controlador de notificaciones
  ) {
    addIcons({
      'alert-circle-outline': alertCircleOutline,
      'mail-outline': mailOutline,
      'lock-closed-outline': lockClosedOutline,
      'call-outline': callOutline,
      'location-outline': locationOutline,
      'map-outline': mapOutline
    });
  }

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
    const codProvincia = event.target.value;
    this.municipios = [];
    this.registroUsuario.get('localidad')?.setValue('');

    if (codProvincia) {
      this.geoService.getMunicipios(codProvincia).subscribe(res => {
        this.municipios = res.data || res;
      });
    }
  }

  async guardar() {
    if (this.registroUsuario.invalid) return;

    const datosForm = this.registroUsuario.value;
    const provinciaObj = this.provincias.find(p => p.CPRO === datosForm.provincia);
    
    const datosFinales = {
      ...datosForm,
      provincia: provinciaObj ? (provinciaObj.PRO || (provinciaObj as any).NOMBRE_PROVINCIA) : datosForm.provincia,
      rolId: 2 
    };

    this.authService.registro(datosFinales).subscribe({
      next: async (res) => {
        // Clics o autocierre: configuramos el Toast de confirmación elegante
        const toast = await this.toastCtrl.create({
          message: '¡Registro completado con éxito! Redirigiendo...',
          duration: 2500,
          color: 'success',
          position: 'top',
          buttons: [
            {
              text: 'OK',
              role: 'cancel'
            }
          ]
        });

        await toast.present();

        // Esperamos a que el Toast termine o el usuario pulse el botón para redirigir al login
        await toast.onDidDismiss();
        this.router.navigate(['/login']);
      },
      error: async (err) => {
        const errorToast = await this.toastCtrl.create({
          message: 'Error en el registro: ' + (err.error?.message || 'Servidor no disponible'),
          duration: 3500,
          color: 'danger',
          position: 'top'
        });
        await errorToast.present();
      }
    });
  }
}