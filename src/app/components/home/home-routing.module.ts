import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryComponent } from '../inventory/inventory.component';
import { LoansComponent } from '../loans/loans.component';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '', 
    component: HomeComponent,
      children: [
        { path: 'inventory', component: InventoryComponent },
        { path: 'loans', component: LoansComponent },
    ]
  },
  {path: '**', redirectTo: 'home', pathMatch: 'full',}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
