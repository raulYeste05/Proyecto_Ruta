import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSegment, IonLabel, IonButton, IonButtons, IonIcon, IonSegmentButton } from '@ionic/angular/standalone';
import { RouterModule, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { logOutOutline, personCircleOutline, chatbubblesOutline, mapOutline, homeOutline } from 'ionicons/icons'; // Importa los que necesites

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-componente-panel-cliente',
  templateUrl: './componente-panel-cliente.page.html',
  styleUrls: ['./componente-panel-cliente.page.scss'],
  standalone: true,
  imports: [IonIcon, IonSegmentButton, IonButtons, IonButton, IonLabel, IonSegment, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterModule]
})
export class ComponentePanelClientePage implements OnInit {

  constructor(private authService: AuthService, private router: Router) {
    // Registra los iconos aquí para que no salgan los errores amarillos de la consola
    addIcons({ logOutOutline, personCircleOutline, chatbubblesOutline, mapOutline, homeOutline });
  }

  ngOnInit() {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}