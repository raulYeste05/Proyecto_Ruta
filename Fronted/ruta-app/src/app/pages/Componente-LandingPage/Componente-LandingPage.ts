import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';          
import { IonicModule } from '@ionic/angular';

import { 
  IonHeader, IonToolbar, IonButtons, IonMenuButton, IonMenu, 
  IonContent, IonList, IonItem, IonIcon, IonLabel, IonTitle, IonButton 
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { 
  accessibilityOutline, addCircleOutline, removeCircleOutline, 
  eyeOutline, volumeMediumOutline, refreshOutline, menuOutline, homeOutline, helpCircleOutline, mailOutline, logInOutline
} from 'ionicons/icons';



@Component({
  selector: 'app-landing',
  templateUrl: './Componente-LandingPage.html',
  styleUrls: ['./Componente-LandingPage.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, IonicModule, 
    IonHeader, IonToolbar, IonButtons, IonMenuButton, IonMenu, 
    IonContent, IonList, IonItem, IonIcon, IonLabel, IonTitle, IonButton
  ]
})
export class LandingPage implements OnInit {
  
  panelAbierto = false;
  isLecturaFacil = false;

  constructor() {
    addIcons({ 
      accessibilityOutline, addCircleOutline, removeCircleOutline, 
      eyeOutline, volumeMediumOutline, refreshOutline, menuOutline, homeOutline, 
      helpCircleOutline, mailOutline, logInOutline
    });
  }

  ngOnInit() {
  }

  toggleAccesibilidad() {
    this.panelAbierto = !this.panelAbierto;
  }

  aumentarTexto() {
    const actual = parseFloat(getComputedStyle(document.documentElement).fontSize);
    document.documentElement.style.fontSize = (actual + 2) + 'px';
  }

  disminuirTexto() {
    const actual = parseFloat(getComputedStyle(document.documentElement).fontSize);
    if (actual > 12) {
      document.documentElement.style.fontSize = (actual - 2) + 'px';
    }
  }



  leerContenido() {
    // Obtenemos solo el texto relevante para evitar leer menús
    const texto = document.querySelector('main')?.innerText || document.body.innerText;
    const speech = new SpeechSynthesisUtterance(texto);
    speech.lang = 'es-ES';
    speech.rate = 0.9;
    window.speechSynthesis.cancel(); // Para evitar que se amontone el audio
    window.speechSynthesis.speak(speech);
  }

  resetAccesibilidad() {
    document.body.classList.remove('lectura-facil');
    this.isLecturaFacil = false;
    document.documentElement.style.fontSize = '16px';
    window.speechSynthesis.cancel();
  }


}
