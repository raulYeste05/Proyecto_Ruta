import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { RouterModule, Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-componente-panel-cliente',
  templateUrl: './componente-panel-cliente.page.html',
  styleUrls: ['./componente-panel-cliente.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterModule]
})
export class ComponentePanelClientePage implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
