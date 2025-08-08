import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../service/auth/auth.service';
import { CartService, Cart, CartItem } from '../service/cart/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent implements OnInit, OnDestroy {
  cart: Cart | null = null;
  loading: boolean = true;
  isGuest: boolean = false;

  constructor(
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.loadCart();
    // Listen for cart updates
    window.addEventListener('cartUpdated', () => {
      this.loadCart();
    });
  }

  ngOnDestroy() {
    window.removeEventListener('cartUpdated', () => {
      this.loadCart();
    });
  }

  loadCart() {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.isGuest = !this.authService.isAuthenticated;
        this.loading = false;
        console.log('Loaded cart:', cart);
        console.log('Is guest user:', this.isGuest);
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.toastService.error('Failed to load cart');
        this.cart = null;
        this.loading = false;
      }
    });
  }

  updateQuantity(itemId: string, newQuantity: number) {
    if (newQuantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    this.cartService.updateCartItem(itemId, { quantity: newQuantity }).subscribe({
      next: (cart) => {
        this.cart = cart;
        this.toastService.success('Cart updated successfully!');
      },
      error: (error) => {
        console.error('Error updating cart:', error);
        this.toastService.error('Failed to update cart');
      }
    });
  }

  removeItem(itemId: string) {
    this.cartService.removeFromCart(itemId).subscribe({
      next: (cart) => {
        this.cart = cart;
        this.toastService.success('Item removed from cart!');
      },
      error: (error) => {
        console.error('Error removing item:', error);
        this.toastService.error('Failed to remove item');
      }
    });
  }

  clearCart() {
    this.cartService.clearCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.toastService.success('Cart cleared successfully!');
      },
      error: (error) => {
        console.error('Error clearing cart:', error);
        this.toastService.error('Failed to clear cart');
      }
    });
  }

  get subtotal(): number {
    return this.cart?.total || 0;
  }

  get totalItems(): number {
    return this.cart?.itemCount || 0;
  }

  proceedToCheckout() {
    if (!this.cart || this.cart.items.length === 0) {
      this.toastService.error('Your cart is empty!');
      return;
    }

    // Check if user is authenticated for checkout
    if (!this.authService.isAuthenticated) {
      this.toastService.error('Please login to proceed to checkout!');
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/checkout' }
      });
      return;
    }

    // User is authenticated, proceed to checkout
    this.router.navigate(['/checkout']);
  }

  continueShopping() {
    this.router.navigate(['/']);
  }

  loginToSaveCart() {
    this.toastService.info('Login to save your cart and proceed to checkout!');
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: '/cart' }
    });
  }
}
