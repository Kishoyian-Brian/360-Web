import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../service/cart/cart.service';
import { AuthService } from '../service/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartItemCount: number = 0;
  isMobileMenuOpen: boolean = false;
  isAdmin: boolean = false;
  private cartSubscription?: Subscription;

  constructor(
    private router: Router,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Check if user is admin
    this.isAdmin = this.authService.isAdmin;
    
    // Subscribe to cart changes to update the cart count
    this.cartSubscription = this.cartService.cart$.subscribe(cart => {
      if (cart) {
        this.cartItemCount = cart.itemCount;
      } else {
        this.cartItemCount = 0;
      }
    });

    // Also get initial cart count
    this.cartService.getCartItemCount().subscribe(count => {
      this.cartItemCount = count;
    });
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  toggleCart(): void {
    // TODO: Implement cart toggle functionality
    console.log('Toggle cart clicked');
  }

  onLoginClick(): void {
    console.log('Login link clicked - navigating to /login');
    this.router.navigate(['/login']);
  }

  toggleMobileMenu(): void {
    console.log('Toggle mobile menu clicked. Current state:', this.isMobileMenuOpen);
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    console.log('New state:', this.isMobileMenuOpen);
    
    // Prevent body scroll when menu is open
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      console.log('Menu opened - body scroll disabled');
    } else {
      document.body.style.overflow = '';
      console.log('Menu closed - body scroll enabled');
    }
  }

  closeMobileMenu(): void {
    console.log('Close mobile menu clicked');
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
    console.log('Menu closed and body scroll restored');
  }

  // Method to handle navigation and close menu
  navigateAndClose(route: string): void {
    console.log('Navigating to:', route);
    this.closeMobileMenu();
    this.router.navigate([route]);
  }
}
