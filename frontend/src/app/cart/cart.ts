import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  loading: boolean = true;

  constructor(
    private router: Router,
    private toastService: ToastService
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
    try {
      const cartData = localStorage.getItem('cart');
      this.cartItems = cartData ? JSON.parse(cartData) : [];
      this.loading = false;
    } catch (error) {
      console.error('Error loading cart:', error);
      this.cartItems = [];
      this.loading = false;
    }
  }

  updateQuantity(itemId: string, newQuantity: number) {
    if (newQuantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    const itemIndex = this.cartItems.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
      this.cartItems[itemIndex].quantity = newQuantity;
      this.saveCart();
      this.toastService.success('Cart updated successfully!');
    }
  }

  removeItem(itemId: string) {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.saveCart();
    this.toastService.success('Item removed from cart!');
  }

  clearCart() {
    this.cartItems = [];
    this.saveCart();
    this.toastService.success('Cart cleared successfully!');
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    // Dispatch event to update header cart count
    window.dispatchEvent(new CustomEvent('cartUpdated', {
      detail: { cartCount: this.cartItems.length }
    }));
  }

  get subtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  get totalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  proceedToCheckout() {
    if (this.cartItems.length === 0) {
      this.toastService.error('Your cart is empty!');
      return;
    }
    this.router.navigate(['/checkout']);
  }

  continueShopping() {
    this.router.navigate(['/']);
  }
} 