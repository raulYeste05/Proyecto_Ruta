import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';          
import { IonicModule } from '@ionic/angular';
@Component({
  selector: 'app-landing',
  templateUrl: './Componente-LandingPage.html',
  styleUrls: ['./Componente-LandingPage.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, IonicModule]
})
export class LandingPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
