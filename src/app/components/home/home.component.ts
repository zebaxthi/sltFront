import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  
  isHomeActived: boolean = true;

  constructor() { 
  }

  ngOnInit(): void {
    location.pathname == '/home' ? this.isHomeActived = true : this.isHomeActived = false;
  }

}
