import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';          
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonCard, IonCardHeader, IonCardContent, IonFooter} from '@ionic/angular/standalone';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  standalone: true,
  imports: [RouterModule,IonFooter, IonCardContent, IonCardHeader, IonCard, IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class LandingPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
