import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { locationOutline, callOutline } from 'ionicons/icons';
import { RouterModule } from '@angular/router'; 
import { 
  personAddOutline, searchOutline, navigateOutline,
  homeOutline, helpCircleOutline, mailOutline, logInOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-componente-contacto',
  templateUrl: './componente-contacto.component.html',
  styleUrls: ['./componente-contacto.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule] 
})
export class ComponenteContactoComponent implements OnInit {

  constructor() {
    addIcons({ 
      locationOutline, 
      mailOutline, 
      callOutline,
      personAddOutline, 
      searchOutline, 
      navigateOutline,
      homeOutline,
      helpCircleOutline,
      logInOutline
    });
  }

  ngOnInit() {}
}