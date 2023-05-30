import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NavbarComponent } from 'src/app/shared/navbar/navbar.component';
import { InputTextModule } from 'primeng/inputtext';
import { WelcomeComponent } from './welcome/welcome.component';
import { PrimengModule } from 'src/app/primeng.module';


@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    WelcomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    InputTextModule,
    PrimengModule
  ],
  exports: [HomeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeModule { }
