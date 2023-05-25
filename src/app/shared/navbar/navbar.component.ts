import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  items: MenuItem[];

    ngOnInit() {
        this.items = [
            {
                label: 'Inventory',
                icon: 'pi pi-fw pi-file',
                command:()=>{location.replace('/inventory');}
            },
            {
                label: 'Loans',
                icon: 'pi pi-fw pi-pencil',
                command:()=>{location.replace('/loans');}
            },
        ];
    }

}
