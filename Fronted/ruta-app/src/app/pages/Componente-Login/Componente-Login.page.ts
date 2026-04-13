import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { AuthService } from '../../services/auth.service';

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
  ) {}

  ngOnInit(): void {

    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
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