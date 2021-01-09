import { environment } from './../../environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { AuthData } from './authData';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const BACK_END = `${environment.backEndDomain}/users`
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string;
  private authStatusListener = new BehaviorSubject<boolean>(false);
  private expireTimeout: any;
  private userId: string;
  constructor(private http: HttpClient, private router: Router) {}

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email,
      password,
    };
    this.http
      .post(`${BACK_END}/signup`, authData)
      .subscribe((createUserData) => {
        this.router.navigate(['/login']);
      }, err => {
        console.log(err);
        this.authStatusListener.next(false);
      });
  }

  login(email, password) {
    const AuthData: AuthData = {
      email,
      password,
    };
    this.http
      .post<{ token: string; expireTime: number; userId: string }>(
        `${BACK_END}/login`,
        AuthData
      )
      .subscribe((response) => {
        console.log('in subscription')
        const expireTime = response.expireTime;
        this.setAuthTimer(expireTime);
        this.userId = response.userId;
        this.token = response.token;
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expireTime * 1000);
        this.saveAuthData(response.token, expirationDate, response.userId);
        this.router.navigate(['/']);
      }, err => {
        console.log(err)
        this.authStatusListener.next(false);
      });
  }

  getUserStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  getToken() {
    return this.token;
  }

  logout() {
    this.token = null;
    this.userId = null;
    this.authStatusListener.next(false);
    clearTimeout(this.expireTimeout);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expireIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expireIn > 0) {
      this.token = authInformation.token;
      this.userId = authInformation.userId;
      this.setAuthTimer(expireIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!(token || expirationDate)) {
      return;
    }
    return {
      token,
      userId,
      expirationDate: new Date(expirationDate),
    };
  }

  private setAuthTimer(duration: number) {
    this.expireTimeout = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
