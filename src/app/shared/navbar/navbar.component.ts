import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../components/login/service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

    items: MenuItem[];

    constructor(private auth: AuthService, private router: Router) {

    }

    ngOnInit() {
        this.items = [
            {
                label: 'Home',
                icon: 'pi pi-fw pi-home',
                command:()=>{location.replace('/home');}
            },
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

    logOut(){
        this.auth.removeToken();
        this.router.navigate(['login']);
    }

}
