import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NavbarComponent } from 'src/app/shared/navbar/navbar.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { PrimengModule } from 'src/app/primeng.module';
import { InventoryModule } from '../inventory/inventory.module';
import { LoansModule } from '../loans/loans.module';


@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    WelcomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    PrimengModule,
    InventoryModule,
    LoansModule
  ],
  exports: [HomeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeModule { }
