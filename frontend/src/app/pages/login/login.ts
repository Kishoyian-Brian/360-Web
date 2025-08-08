import { Component, OnInit, OnDestroy } from "@angular/core";

import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, LoginRequest } from '../../service/auth/auth.service';
import { CartService } from '../../service/cart/cart.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit, OnDestroy {
  loginData: LoginRequest = {
    email: '',
    password: ''
  };

  isLoading = false;
  isFormValid = false;
  returnUrl: string = '/home';

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Clear form fields when component initializes (e.g., after logout)
    this.clearLoginForm();
    
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/home';
    });

    if (this.authService.isAuthenticated) {
      this.redirectBasedOnRole();
    }
  }

  ngOnDestroy(): void {
    // Clear form fields when component is destroyed
    this.clearLoginForm();
  }

  clearLoginForm(): void {
    this.loginData = {
      email: '',
      password: ''
    };
    this.isFormValid = false;
    this.isLoading = false;
  }

  onInputChange(): void {
    this.isFormValid = this.loginData.email.trim().length > 0 && 
                      this.loginData.password.trim().length > 0;
  }

  onLogin(): void {
    if (!this.isFormValid) {
      this.toastService.error('Please fill in all fields');
      return;
    }

    this.isLoading = true;

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.toastService.success('Login successful!');
        
        // Merge guest cart with server cart after successful login
        this.cartService.mergeGuestCart().subscribe({
          next: (cart) => {
            console.log('Guest cart merged successfully');
            this.toastService.success('Your cart items have been saved!');
          },
          error: (error) => {
            console.error('Error merging guest cart:', error);
            // Don't fail login if cart merge fails
          },
          complete: () => {
            this.handleSuccessfulLogin();
          }
        });
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login error:', error);
        const errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
        this.toastService.error(errorMessage);
      }
    });
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onLogin();
    }
  }

  private handleSuccessfulLogin(): void {
    // Check if returnUrl is safe for the user's role
    if (this.returnUrl && this.returnUrl !== '/home') {
      // If user is admin and returnUrl is admin page, allow it
      if (this.authService.isAdmin && this.returnUrl === '/admin') {
        this.router.navigate([this.returnUrl]);
        return;
      }
      // If user is not admin and returnUrl is admin page, redirect to home
      if (!this.authService.isAdmin && this.returnUrl === '/admin') {
        this.router.navigate(['/home']);
        return;
      }
      // For other returnUrls, check if user has permission (you can add more checks here)
      this.router.navigate([this.returnUrl]);
    } else {
      this.redirectBasedOnRole();
    }
  }

  private redirectBasedOnRole(): void {
    if (this.authService.isAdmin) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
