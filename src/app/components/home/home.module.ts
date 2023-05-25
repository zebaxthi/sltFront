import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NavbarComponent } from 'src/app/shared/navbar/navbar.component';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { WelcomeComponent } from './welcome/welcome.component';


@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    WelcomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MenubarModule,
    InputTextModule
  ],
  exports: [HomeComponent]
})
export class HomeModule { }
