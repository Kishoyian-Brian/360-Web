import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class CartAdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  canActivate(): boolean {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated) {
      console.log('CartAdminGuard: User not authenticated, redirecting to login');
      this.toastService.error('Please login to access this page');
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return false;
    }

    // Check if user is admin - if admin, deny access to cart/checkout
    if (this.authService.isAdmin) {
      console.log('CartAdminGuard: Admin user attempting to access cart/checkout, redirecting to admin');
      this.toastService.error('Admin users cannot access cart or checkout pages');
      this.router.navigate(['/admin']);
      return false;
    }

    // User is authenticated and is not admin - allow access
    console.log('CartAdminGuard: Non-admin user, allowing access to cart/checkout');
    return true;
  }
}
