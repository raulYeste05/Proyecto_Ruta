import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { IonicModule } from '@ionic/angular'; 
import { addIcons } from 'ionicons'; 
import { 
  personAddOutline, searchOutline, navigateOutline,
  homeOutline, helpCircleOutline, mailOutline, logInOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-componente-como-funciona',
  templateUrl: './componente-como-funciona.component.html',
  styleUrls: ['./componente-como-funciona.component.scss'],
  standalone: true, 
  imports: [
    CommonModule, 
    IonicModule, 
    RouterModule 
  ] 
})
export class ComponenteComoFuncionaComponent implements OnInit {

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