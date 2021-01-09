import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  isLoading = false;
  authStatusSub: Subscription;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService.getUserStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    })
  }

  onSignup(signupForm: NgForm) {
    console.log('signup');
    this.authService.createUser(signupForm.value.email, signupForm.value.password);

  }
}
