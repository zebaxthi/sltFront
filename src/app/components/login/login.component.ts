import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './service/auth.service';
import { CredentialsUser } from 'src/app/domain/credentialsUser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading: boolean;

  user: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"), Validators.required]),
    password: new FormControl('', Validators.required)
  });

  constructor(public auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  signIn(from: CredentialsUser){
    this.auth.authenticate(from).subscribe(res => {
      this.loading = true;
      this.auth.saveToken(res['data']['token']);
      this.router.navigate(['home']);
    }, error => {
      console.log(error);
      this.loading = false;
    }, () => {
      this.loading = false;
    } );
  }

}
