import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { IonicModule } from '@ionic/angular';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { 
  personAddOutline, searchOutline, navigateOutline,
  homeOutline, helpCircleOutline, mailOutline, logInOutline 
} from 'ionicons/icons';


@Component({
  selector: 'app-componente-privacidada',
  templateUrl: './componente-privacidada.component.html',
  styleUrls: ['./componente-privacidada.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class ComponentePrivacidadaComponent  implements OnInit {

  constructor() {
    addIcons({ 
      personAddOutline, 
      searchOutline, 
      navigateOutline,
      homeOutline,
      helpCircleOutline,
      mailOutline,
      logInOutline
    });
   }

  ngOnInit() {}

}
