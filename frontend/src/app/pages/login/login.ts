import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginData = {
    username: '',
    password: ''
  };

  onLogin() {
    console.log('Login attempt:', this.loginData);
    // Add your login logic here
    // For now, just log the data
  }
}
