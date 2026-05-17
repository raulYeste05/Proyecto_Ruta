import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from "@ionic/angular";
import { RouterModule } from '@angular/router';
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";

import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';

@Component({
  selector: 'app-componente-layout-admin',
  templateUrl: './componente-layout-admin.page.html',
  styleUrls: ['./componente-layout-admin.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule
  ]
})
export class ComponenteLayoutAdminPage implements OnInit {

  constructor( 
    private authService: AuthService, 
    private router: Router) {
      addIcons({ logOutOutline });
  }

  ngOnInit() {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

}