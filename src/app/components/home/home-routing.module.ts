import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryComponent } from '../inventory/inventory.component';
import { LoansComponent } from '../loans/loans.component';
import { HomeComponent } from './home.component';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '', 
    component: HomeComponent,
      children: [
        { path: 'inventory', loadChildren: () => import('../inventory/inventory.module').then(l => l.InventoryModule), canActivate: [AuthGuard] },
        { path: 'loans', component: LoansComponent, canActivate: [AuthGuard] },
    ]
  },
  {path: '**', redirectTo: 'home', pathMatch: 'full',}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
