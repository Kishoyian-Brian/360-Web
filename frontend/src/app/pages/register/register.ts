import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth/auth.service';
import { ToastService } from '../../services/toast.service';

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

  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  onRegister() {
    // Reset error message
    this.errorMessage = '';
    
    // Validate passwords match
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      this.toastService.error('Passwords do not match');
      return;
    }

    // Validate password length
    if (this.registerData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      this.toastService.error('Password must be at least 6 characters long');
      return;
    }

    this.isLoading = true;

    // Send all required fields including confirmPassword
    const registrationData = {
      username: this.registerData.username,
      email: this.registerData.email,
      password: this.registerData.password,
      confirmPassword: this.registerData.confirmPassword
    };

    this.authService.register(registrationData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.isLoading = false;
        this.toastService.success('Registration successful! Please log in.');
        // Redirect to login page
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        this.toastService.error(this.errorMessage);
      }
    });
  }
}
