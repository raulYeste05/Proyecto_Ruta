import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from "@ionic/angular";
import { RouterModule } from '@angular/router';

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

  constructor() {}

  ngOnInit() {}

}