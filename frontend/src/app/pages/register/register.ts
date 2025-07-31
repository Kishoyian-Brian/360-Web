import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  onRegister() {
    console.log('Register attempt:', this.registerData);
    // Add your registration logic here
    // For now, just log the data
  }
}
