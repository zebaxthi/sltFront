import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { map } from 'rxjs';
import { CredentialsUser } from 'src/app/domain/credentialsUser';
import { User } from 'src/app/domain/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private urlMicroServiceSTL = '';

  constructor(public http: HttpClient) { 
    this.urlMicroServiceSTL = environment.urlMicroServiceSTL;
  }

  authenticate(user: CredentialsUser){
    const url = `${this.urlMicroServiceSTL}/authenticate`;
    return this.http.post(url, user);
  }

  register(user: User){
    const url = `${this.urlMicroServiceSTL}/register`;
    return this.http.post(url, user);
  }

  saveToken(token: string){
    sessionStorage.setItem('currentUser', token);
  }

  getToken(){
    return sessionStorage.getItem('currentUser');
  }

  removeToken(){
    sessionStorage.removeItem('currentUser');
  }

  getDataUser(){
    let token: any = sessionStorage.getItem('currentUser' ) == null ? null : sessionStorage.getItem('currentUser');
    let userData: any = token == null || token.length < 35? null : jwtDecode(token);
    return userData;
  }
}
