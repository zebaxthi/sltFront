import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: FormGroup = new FormGroup({});

  constructor() { }

  ngOnInit() {
    this.user = new FormGroup({
        email: new FormControl<string | null>(null),
        password: new FormControl<string | null>(null)
    });
}

}
