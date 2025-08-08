import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  stockQuantity: number; // Changed from 'stock' to match backend
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly API_URL = 'http://localhost:3000/api';
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();
  private readonly GUEST_CART_KEY = 'guest_cart';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Initialize cart based on authentication status
    this.initializeCart();
    
    // Listen for authentication state changes
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        // User logged in, switch to server cart
        this.loadServerCart();
      } else {
        // User logged out, switch to guest cart
        this.loadGuestCart();
      }
    });
  }

  private initializeCart() {
    if (this.authService.isAuthenticated) {
      this.loadServerCart();
    } else {
      this.loadGuestCart();
    }
  }

  private loadServerCart() {
    this.getCart().subscribe({
      next: (cart) => {
        this.cartSubject.next(cart);
      },
      error: (error) => {
        console.error('Error loading server cart:', error);
        this.cartSubject.next(null);
      }
    });
  }

  private loadGuestCart() {
    const guestCart = this.getGuestCart();
    if (guestCart) {
      this.cartSubject.next(guestCart);
    } else {
      this.cartSubject.next(this.createEmptyCart());
    }
  }

  private getGuestCart(): Cart | null {
    try {
      const cartData = localStorage.getItem(this.GUEST_CART_KEY);
      return cartData ? JSON.parse(cartData) : null;
    } catch (error) {
      console.error('Error loading guest cart:', error);
      return null;
    }
  }

  private saveGuestCart(cart: Cart) {
    try {
      localStorage.setItem(this.GUEST_CART_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving guest cart:', error);
    }
  }

  private createEmptyCart(): Cart {
    return {
      id: 'guest',
      userId: 'guest',
      items: [],
      total: 0,
      itemCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private updateGuestCart(cart: Cart) {
    this.saveGuestCart(cart);
    this.cartSubject.next(cart);
  }

  // Get user's cart (server or guest)
  getCart(): Observable<Cart> {
    if (this.authService.isAuthenticated) {
      return this.http.get<Cart>(`${this.API_URL}/cart`, {
        headers: this.authService.getAuthHeaders()
      }).pipe(
        tap(cart => this.cartSubject.next(cart))
      );
    } else {
      const guestCart = this.getGuestCart() || this.createEmptyCart();
      return of(guestCart).pipe(
        tap(cart => this.cartSubject.next(cart))
      );
    }
  }

  // Add item to cart (server or guest)
  addToCart(request: AddToCartRequest): Observable<Cart> {
    if (this.authService.isAuthenticated) {
      return this.http.post<Cart>(`${this.API_URL}/cart/add`, request, {
        headers: this.authService.getAuthHeaders()
      }).pipe(
        tap(cart => this.cartSubject.next(cart))
      );
    } else {
      return this.addToGuestCart(request);
    }
  }

  private addToGuestCart(request: AddToCartRequest): Observable<Cart> {
    const currentCart = this.getGuestCart() || this.createEmptyCart();
    
    // Check if item already exists
    const existingItemIndex = currentCart.items.findIndex(item => item.productId === request.productId);
    
    if (existingItemIndex >= 0) {
      // Update quantity
      currentCart.items[existingItemIndex].quantity += request.quantity;
    } else {
      // Add new item (we'll need to get product details)
      const newItem: CartItem = {
        id: `guest_${Date.now()}_${Math.random()}`,
        productId: request.productId,
        name: 'Product', // Will be updated when we get product details
        price: 0, // Will be updated when we get product details
        quantity: request.quantity,
        image: undefined,
        stockQuantity: 0
      };
      currentCart.items.push(newItem);
    }

    // Recalculate totals
    currentCart.total = currentCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    currentCart.itemCount = currentCart.items.length;
    currentCart.updatedAt = new Date().toISOString();

    this.updateGuestCart(currentCart);
    return of(currentCart);
  }

  // Update cart item quantity
  updateCartItem(itemId: string, request: UpdateCartItemRequest): Observable<Cart> {
    if (this.authService.isAuthenticated) {
      return this.http.patch<Cart>(`${this.API_URL}/cart/${itemId}`, request, {
        headers: this.authService.getAuthHeaders()
      }).pipe(
        tap(cart => this.cartSubject.next(cart))
      );
    } else {
      return this.updateGuestCartItem(itemId, request);
    }
  }

  private updateGuestCartItem(itemId: string, request: UpdateCartItemRequest): Observable<Cart> {
    const currentCart = this.getGuestCart() || this.createEmptyCart();
    const itemIndex = currentCart.items.findIndex(item => item.id === itemId);
    
    if (itemIndex >= 0) {
      if (request.quantity <= 0) {
        // Remove item if quantity is 0 or less
        currentCart.items.splice(itemIndex, 1);
      } else {
        currentCart.items[itemIndex].quantity = request.quantity;
      }
      
      // Recalculate totals
      currentCart.total = currentCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      currentCart.itemCount = currentCart.items.length;
      currentCart.updatedAt = new Date().toISOString();
      
      this.updateGuestCart(currentCart);
    }
    
    return of(currentCart);
  }

  // Remove item from cart
  removeFromCart(itemId: string): Observable<Cart> {
    if (this.authService.isAuthenticated) {
      return this.http.delete<Cart>(`${this.API_URL}/cart/${itemId}`, {
        headers: this.authService.getAuthHeaders()
      }).pipe(
        tap(cart => this.cartSubject.next(cart))
      );
    } else {
      return this.removeFromGuestCart(itemId);
    }
  }

  private removeFromGuestCart(itemId: string): Observable<Cart> {
    const currentCart = this.getGuestCart() || this.createEmptyCart();
    const itemIndex = currentCart.items.findIndex(item => item.id === itemId);
    
    if (itemIndex >= 0) {
      currentCart.items.splice(itemIndex, 1);
      
      // Recalculate totals
      currentCart.total = currentCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      currentCart.itemCount = currentCart.items.length;
      currentCart.updatedAt = new Date().toISOString();
      
      this.updateGuestCart(currentCart);
    }
    
    return of(currentCart);
  }

  // Clear entire cart
  clearCart(): Observable<Cart> {
    if (this.authService.isAuthenticated) {
      return this.http.delete<Cart>(`${this.API_URL}/cart`, {
        headers: this.authService.getAuthHeaders()
      }).pipe(
        tap(cart => this.cartSubject.next(cart))
      );
    } else {
      return this.clearGuestCart();
    }
  }

  private clearGuestCart(): Observable<Cart> {
    const emptyCart = this.createEmptyCart();
    this.updateGuestCart(emptyCart);
    return of(emptyCart);
  }

  // Get cart item count (for header display)
  getCartItemCount(): Observable<number> {
    if (this.authService.isAuthenticated) {
      return this.http.get<{ count: number }>(`${this.API_URL}/cart/count`, {
        headers: this.authService.getAuthHeaders()
      }).pipe(
        tap(response => {
          window.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: { cartCount: response.count }
          }));
        }),
        map(response => response.count)
      );
    } else {
      const guestCart = this.getGuestCart();
      const count = guestCart ? guestCart.itemCount : 0;
      return of(count);
    }
  }

  // Get current cart value (synchronous)
  getCurrentCart(): Cart | null {
    return this.cartSubject.value;
  }

  // Refresh cart from server
  refreshCart(): void {
    if (this.authService.isAuthenticated) {
      this.getCart().subscribe({
        error: (error) => {
          console.error('Error refreshing cart:', error);
          this.cartSubject.next(null);
        }
      });
    } else {
      this.loadGuestCart();
    }
  }

  // Merge guest cart with server cart after login
  mergeGuestCart(): Observable<Cart> {
    const guestCart = this.getGuestCart();
    if (!guestCart || guestCart.items.length === 0) {
      return this.getCart();
    }

    // Add each guest cart item to server cart
    const addRequests = guestCart.items.map(item => 
      this.http.post<Cart>(`${this.API_URL}/cart/add`, {
        productId: item.productId,
        quantity: item.quantity
      }, {
        headers: this.authService.getAuthHeaders()
      })
    );

    // Execute all requests sequentially
    return addRequests.reduce((acc, request) => 
      acc.pipe(switchMap(() => request))
    ).pipe(
      tap(() => {
        // Clear guest cart after successful merge
        localStorage.removeItem(this.GUEST_CART_KEY);
      })
    );
  }

  // Update product details in guest cart (called when product details are loaded)
  updateGuestCartItemDetails(productId: string, productDetails: { name: string; price: number; image?: string; stockQuantity: number }) {
    if (!this.authService.isAuthenticated) {
      const currentCart = this.getGuestCart();
      if (currentCart) {
        const item = currentCart.items.find(item => item.productId === productId);
        if (item) {
          item.name = productDetails.name;
          item.price = productDetails.price;
          item.image = productDetails.image;
          item.stockQuantity = productDetails.stockQuantity;
          
          // Recalculate totals
          currentCart.total = currentCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          currentCart.updatedAt = new Date().toISOString();
          
          this.updateGuestCart(currentCart);
        }
      }
    }
  }
}
