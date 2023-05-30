import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { AuthService } from 'src/app/components/login/service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return of(this.auth.getDataUser()).pipe(
      map((userData: any) => {
        if (!userData) {
          this.redirectToLogin();
          return true;
        } else {
          this.redirectToUrl();
          return true;
        }
      })
    );
  }

  private redirectToLogin(): void {
    if (location.pathname !== '/login') {
      location.replace('/login');
    }
  }

  private redirectToUrl(): void {
    if (location.pathname === '/login') {
      location.replace('/home');
    }
  }
}

