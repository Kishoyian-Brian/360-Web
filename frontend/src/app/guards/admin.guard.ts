import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  canActivate(): boolean {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated) {
      console.log('AdminGuard: User not authenticated, redirecting to login');
      this.toastService.error('Please login to access this page');
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return false;
    }

    // Check if user is admin
    if (!this.authService.isAdmin) {
      console.log('AdminGuard: User is not admin, redirecting to home. User role:', this.authService.currentUser?.role);
      this.toastService.error('Access denied. Admin privileges required.');
      // Redirect to home page with error message
      this.router.navigate(['/home']);
      return false;
    }

    // User is authenticated and is admin
    console.log('AdminGuard: User is admin, allowing access');
    return true;
  }

  // Helper method to check if user is admin
  isUserAdmin(): boolean {
    return this.authService.isAuthenticated && this.authService.isAdmin;
  }
} 