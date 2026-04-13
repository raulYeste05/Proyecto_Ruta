import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-componente-rutas',
  templateUrl: './componente-rutas.page.html',
  styleUrls: ['./componente-rutas.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ComponenteRutasPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
