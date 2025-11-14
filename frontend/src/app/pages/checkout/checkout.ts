import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../service/auth/auth.service';
import { CartService, Cart, CartItem } from '../../service/cart/cart.service';
import { OrderService, Order, CreateOrderRequest } from '../../service/order/order.service';
import { ProductService } from '../../service/product/product.service';
import { CryptoService, CryptoAccount } from '../../service/crypto/crypto.service';
import { ProductUtils } from '../../shared/utils/product.utils';

// Remove the old interface as we now use CryptoAccount from the service

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {
  cart: Cart | null = null;
  order: Order | null = null;
  isLoading = false;
  paymentProofFile: File | null = null;
  paymentProofPreview: string | null = null;
  isSubmittingPayment = false;

  // Cryptocurrency payment options (loaded from backend)
  cryptoPayments: CryptoAccount[] = [];
  selectedCrypto: CryptoAccount | null = null;
  

  cryptoAmount = 0;
  orderId = '';

  constructor(
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService,
    private cartService: CartService,
    private orderService: OrderService,
    private productService: ProductService,
    private cryptoService: CryptoService
  ) { }

  ngOnInit() {
    // Check if user is admin - redirect to admin dashboard
    if (this.authService.isAuthenticated && this.authService.isAdmin) {
      console.log('Checkout: Admin user attempting to access checkout, redirecting to admin');
      this.toastService.error('Admin users cannot access checkout pages');
      this.router.navigate(['/admin']);
      return;
    }

    this.loadCart();
    this.loadCryptoAccounts();
  }

  private cartLoaded = false;
  private cryptoLoaded = false;

  private checkIfReadyToCreateOrder() {
    if (this.cartLoaded && this.cryptoLoaded && this.cart && this.cryptoPayments.length > 0) {
      console.log('Both cart and crypto accounts loaded, creating order...');
      this.createOrder();
    }
  }

  loadCart() {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.cryptoAmount = cart.total;
        console.log('Loaded cart from backend:', cart);
        
        // For guest carts, ensure product details are loaded
        this.ensureProductDetails(cart);
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.toastService.error('Failed to load cart');
        this.isLoading = false;
        this.router.navigate(['/cart']);
      }
    });
  }

  private ensureProductDetails(cart: Cart) {
    // Check if any cart items have missing product details (price = 0)
    const itemsNeedingDetails = cart.items.filter(item => item.price === 0 || !item.name || item.name === 'Product');
    
    if (itemsNeedingDetails.length > 0) {
      console.log('Some cart items need product details, fetching...', itemsNeedingDetails);
      
      // Fetch product details for items that need them
      const detailPromises = itemsNeedingDetails.map(item => 
        this.productService.getProduct(item.productId).toPromise()
      );
      
      Promise.all(detailPromises).then(products => {
        products.forEach((product, index) => {
          if (product) {
            const item = itemsNeedingDetails[index];
            // Update cart service with proper product details
            this.cartService.updateGuestCartItemDetails(item.productId, {
              name: product.name,
              price: product.price,
              // Use ProductUtils to ensure HTTPS URL
              image: ProductUtils.getProductImage(product),
              stockQuantity: product.stockQuantity
            });
          }
        });
        
        // Reload cart to get updated details
        this.cartService.getCart().subscribe({
          next: (updatedCart) => {
            this.cart = updatedCart;
            this.cryptoAmount = updatedCart.total;
            this.isLoading = false;
            console.log('Updated cart with product details:', updatedCart);
            this.cartLoaded = true;
            this.checkIfReadyToCreateOrder();
          },
          error: (error) => {
            console.error('Error reloading cart:', error);
            this.isLoading = false;
          }
        });
      }).catch(error => {
        console.error('Error fetching product details:', error);
        this.isLoading = false;
      });
    } else {
      this.isLoading = false;
      this.cartLoaded = true;
      this.checkIfReadyToCreateOrder();
    }
  }

  createOrder() {
    if (!this.cart || this.cart.items.length === 0) {
      this.toastService.error('Your cart is empty!');
      this.router.navigate(['/cart']);
      return;
    }

    // Check if order already exists
    if (this.order) {
      console.log('Order already exists:', this.order.id);
      return;
    }

    this.isLoading = true;
    const orderRequest: CreateOrderRequest = {
      paymentMethod: this.selectedCrypto ? this.selectedCrypto.symbol : 'CRYPTO'
    };

    console.log('Creating order with request:', orderRequest);

    this.orderService.createOrder(orderRequest).subscribe({
      next: (order) => {
        this.order = order;
        this.orderId = order.id;
        this.isLoading = false;
        this.toastService.success('Order created successfully!');
        console.log('Order created:', order);
      },
      error: (error) => {
        console.error('Error creating order:', error);
        this.toastService.error('Failed to create order');
        this.isLoading = false;
      }
    });
  }

  loadCryptoAccounts() {
    this.cryptoService.getActiveAccounts().subscribe({
      next: (accounts) => {
        this.cryptoPayments = accounts;
        if (accounts.length > 0 && !this.selectedCrypto) {
          this.selectedCrypto = accounts[0]; // Default to first account
        }
        console.log('Loaded crypto accounts:', accounts);
        this.cryptoLoaded = true;
        this.checkIfReadyToCreateOrder();
      },
      error: (error) => {
        console.error('Error loading crypto accounts:', error);
        this.toastService.error('Failed to load payment methods');
        this.cryptoLoaded = true; // Set to true even on error so we don't block order creation
        this.checkIfReadyToCreateOrder();
      }
    });
  }

  selectCryptoPayment(crypto: CryptoAccount) {
    this.selectedCrypto = crypto;
  }

  copyCryptoAddress() {
    if (!this.selectedCrypto) return;
    
    navigator.clipboard.writeText(this.selectedCrypto.address).then(() => {
      this.toastService.success(`${this.selectedCrypto!.name} address copied to clipboard!`);
    }).catch(() => {
      this.toastService.error('Failed to copy address');
    });
  }

  getCryptoDisplayName(crypto: CryptoAccount): string {
    if (crypto.network) {
      return `${crypto.name} (${crypto.network})`;
    }
    return crypto.name;
  }



  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.toastService.error('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.toastService.error('File size must be less than 5MB');
        return;
      }

      this.paymentProofFile = file;
      console.log('Payment proof file selected:', file.name, file.size);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.paymentProofPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      // Clear the file if none selected
      this.paymentProofFile = null;
      this.paymentProofPreview = null;
      console.log('No file selected, cleared payment proof');
    }
  }

  removePaymentProof() {
    this.paymentProofFile = null;
    this.paymentProofPreview = null;
    
    // Clear the file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    console.log('Payment proof removed and file input cleared');
  }

  submitPaymentProof() {
    console.log('Submit payment proof called');
    console.log('Payment proof file:', this.paymentProofFile);
    console.log('Order:', this.order);
    
    if (!this.paymentProofFile || !this.order) {
      if (!this.paymentProofFile) {
        console.log('No payment proof file selected');
        this.toastService.error('Please select a payment proof image');
      }
      if (!this.order) {
        console.log('No order found');
        this.toastService.error('Order not found. Please refresh and try again.');
      }
      return;
    }

    this.isSubmittingPayment = true;
    console.log('Submitting payment proof for order:', this.order.id);

    this.orderService.submitPaymentProof(this.order.id, this.paymentProofFile).subscribe({
      next: (updatedOrder) => {
        this.order = updatedOrder;
        this.isSubmittingPayment = false;
        this.toastService.success('Payment proof submitted successfully! We will verify your payment shortly.');
        console.log('Payment proof submitted successfully:', updatedOrder);
      },
      error: (error) => {
        console.error('Error submitting payment proof:', error);
        this.toastService.error('Failed to submit payment proof. Please try again.');
        this.isSubmittingPayment = false;
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'paid': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-orange-600 bg-orange-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Pending Payment';
      case 'paid': return 'Payment Received';
      case 'processing': return 'Processing Order';
      case 'completed': return 'Order Completed';
      case 'cancelled': return 'Order Cancelled';
      default: return 'Unknown Status';
    }
  }

  continueShopping() {
    this.router.navigate(['/shop']);
  }

  viewOrderHistory() {
    this.router.navigate(['/orders']);
  }

  getItemImage(item: CartItem): string {
    if (item.image) {
      // Ensure HTTPS for image URL (required for Telegram WebView)
      return ProductUtils.ensureHttps(item.image);
    }
    return 'https://via.placeholder.com/64x64/cccccc/666666?text=No+Image';
  }
}
