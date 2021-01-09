import { Subscription } from 'rxjs';
import { AuthService } from './../auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  userStausListenerSub: Subscription;
  constructor(private authService: AuthService) {}
  
  ngOnInit(): void {
    this.userStausListenerSub = this.authService.getUserStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    })
  }
  ngOnDestroy(): void {
    this.userStausListenerSub.unsubscribe();
  }

  onLogin(form: NgForm) {
    this.authService.login(form.value.email, form.value.password)
  }
}
