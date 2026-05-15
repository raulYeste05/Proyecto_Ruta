import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { locationOutline, mailOutline, callOutline } from 'ionicons/icons';

@Component({
  selector: 'app-componente-contacto',
  templateUrl: './componente-contacto.component.html',
  styleUrls: ['./componente-contacto.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ComponenteContactoComponent implements OnInit {

  constructor() {
    addIcons({ 
      locationOutline, 
      mailOutline, 
      callOutline 
    });
  }

  ngOnInit() {}
}