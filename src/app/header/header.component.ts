import { AuthService } from './../auth/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public isAuthenticated: boolean;
  userStatusSubscription: Subscription;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userStatusSubscription = this.authService
      .getUserStatusListener()
      .subscribe((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
      });
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.userStatusSubscription.unsubscribe();
  }
}
