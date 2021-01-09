import { AuthData } from './authData';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authSerivce: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let isAuthenticated;
      this.authSerivce.getUserStatusListener().subscribe(isAuth => {
        isAuthenticated = isAuth;
      })

      if (isAuthenticated) {
        return true
      } else {
        this.router.navigate(['/']);
        return false;
      }
    
  }
  
}
