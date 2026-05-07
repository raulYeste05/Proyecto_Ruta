import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { validaciones } from '../../Validators/validaciones';

import { AuthService } from '../../services/auth.service';

import {addIcons} from 'ionicons';
import { mailOutline, lockClosedOutline, arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './Componente-Login.page.html',
  styleUrls: ['./Componente-Login.page.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule, IonicModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {

  form!: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ 
      mailOutline, lockClosedOutline, arrowBackOutline 
    });
  }

  ngOnInit(): void {

    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, validaciones.email]),
      password: new FormControl('', [Validators.required, validaciones.contrasena])
    });

  }

    login() {

    if (this.form.invalid) return;

    this.authService.login(this.form.value).subscribe({

      next: (res) => {

        console.log("Login OK:", res);

        // ✔ Mejor usar tu servicio
        this.authService.guardarSesion(res.token, res.rol);

        //  REDIRECCIÓN POR ROL
        if (res.rol === 'ADMIN') {
          this.router.navigate(['/componente-panel-admin']);
        } else {
          this.router.navigate(['/componente-panel-cliente']);
        }

      },

      error: (err) => {
        console.error("Error login:", err);
      }

    });
  }
}