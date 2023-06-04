import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoansComponent } from './loans.component';
import { PrimengModule } from 'src/app/primeng.module';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: LoansComponent
  }
];

@NgModule({
  declarations: [LoansComponent],
  imports: [
    CommonModule,
    PrimengModule,
    RouterModule.forChild(routes)
  ],
  exports: [LoansComponent,
  RouterModule]
})
export class LoansModule { }
