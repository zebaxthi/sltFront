import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryComponent } from './inventory.component';
import { PrimengModule } from 'src/app/primeng.module';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: InventoryComponent
  }
];

@NgModule({
  declarations: [InventoryComponent],
  imports: [
    CommonModule,
    PrimengModule,
    RouterModule.forChild(routes)
  ],
  exports: [InventoryComponent,
  RouterModule]
})
export class InventoryModule { }
