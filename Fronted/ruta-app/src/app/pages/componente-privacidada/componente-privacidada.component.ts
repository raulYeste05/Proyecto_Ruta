import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Title, Meta } from '@angular/platform-browser';


@Component({
  selector: 'app-componente-privacidada',
  templateUrl: './componente-privacidada.component.html',
  styleUrls: ['./componente-privacidada.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ComponentePrivacidadaComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
