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
import { FakeDownloadFlowComponent } from '../../shared/components/fake-download-flow/fake-download-flow.component';

// Remove the old interface as we now use CryptoAccount from the service

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule, RouterModule, FakeDownloadFlowComponent],
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

  // Simulated "admin approval" + gating flags for fake download
  hasPaid: boolean = false;
  hasUploadedProof: boolean = false;
  isAdminApproved: boolean = true;
  downloadProductInfo: string = '';
  readonly downloadAdminEmail: string = 'alfredkaizen30@gmail.com';

  private readonly ORDER_ID_KEY = 'checkout_order_id';
  private readonly CRYPTO_SYMBOL_KEY = 'checkout_crypto_symbol';
  private readonly HAS_UPLOADED_PROOF_KEY = 'checkout_has_uploaded_proof';
  private readonly HAS_PAID_KEY = 'checkout_has_paid';
  private orderChecked = false;
  private pendingCryptoSymbol: string | null = null;

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

    this.restoreCheckoutState();
    this.loadCart();
    this.loadCryptoAccounts();
  }

  private cartLoaded = false;
  private cryptoLoaded = false;

  private checkIfReadyToCreateOrder() {
    if (!this.orderChecked) {
      return;
    }

    if (this.order) {
      return;
    }

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
        this.downloadProductInfo = this.buildProductInfo(cart);
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
            this.downloadProductInfo = this.buildProductInfo(updatedCart);
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
        localStorage.setItem(this.ORDER_ID_KEY, order.id);
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
      next: async (accounts) => {
        this.cryptoPayments = accounts;
        if (accounts.length > 0 && !this.selectedCrypto) {
          this.selectedCrypto = this.resolveSelectedCrypto(accounts);
          // Ensure QR code is generated for default selected crypto
          if (this.selectedCrypto.address && !this.selectedCrypto.qrCode) {
            try {
              this.selectedCrypto.qrCode = await this.cryptoService.generateQRCodeForAccount(this.selectedCrypto);
            } catch (error) {
              console.error('Error generating QR code for default crypto:', error);
            }
          }
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

  async selectCryptoPayment(crypto: CryptoAccount) {
    this.selectedCrypto = crypto;
    localStorage.setItem(this.CRYPTO_SYMBOL_KEY, crypto.symbol);
    // Ensure QR code is generated for selected crypto
    if (crypto.address && !crypto.qrCode) {
      try {
        crypto.qrCode = await this.cryptoService.generateQRCodeForAccount(crypto);
      } catch (error) {
        console.error('Error generating QR code for selected crypto:', error);
      }
    }
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

        // Simulated flags for fake download flow
        this.hasUploadedProof = true;
        this.hasPaid = true;
        localStorage.setItem(this.HAS_UPLOADED_PROOF_KEY, 'true');
        localStorage.setItem(this.HAS_PAID_KEY, 'true');
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

  private buildProductInfo(cart: Cart): string {
    try {
      return cart.items
        .map(item => {
          const name = item.name || 'Product';
          const qty = item.quantity ?? 1;
          const price = typeof item.price === 'number' ? item.price.toFixed(2) : '0.00';
          return `- ${name} (x${qty}) @ $${price}`;
        })
        .join('\n');
    } catch {
      return '';
    }
  }

  private restoreCheckoutState() {
    const storedOrderId = localStorage.getItem(this.ORDER_ID_KEY);
    if (storedOrderId) {
      this.loadExistingOrder(storedOrderId);
    } else {
      this.orderChecked = true;
    }

    this.pendingCryptoSymbol = localStorage.getItem(this.CRYPTO_SYMBOL_KEY);

    const storedHasUploaded = localStorage.getItem(this.HAS_UPLOADED_PROOF_KEY);
    const storedHasPaid = localStorage.getItem(this.HAS_PAID_KEY);
    this.hasUploadedProof = storedHasUploaded === 'true';
    this.hasPaid = storedHasPaid === 'true';
  }

  private loadExistingOrder(orderId: string) {
    this.orderService.getOrder(orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.orderId = order.id;
        this.syncFlagsFromOrder(order);
        this.orderChecked = true;
        this.checkIfReadyToCreateOrder();
      },
      error: (error) => {
        console.warn('Failed to restore order from storage, creating new order.', error);
        localStorage.removeItem(this.ORDER_ID_KEY);
        this.orderChecked = true;
        this.checkIfReadyToCreateOrder();
      }
    });
  }

  private resolveSelectedCrypto(accounts: CryptoAccount[]): CryptoAccount {
    if (this.pendingCryptoSymbol) {
      const match = accounts.find(a => a.symbol === this.pendingCryptoSymbol);
      if (match) {
        return match;
      }
    }

    return accounts[0];
  }

  private syncFlagsFromOrder(order: Order) {
    const paidStatuses = ['paid', 'processing', 'completed'];
    const orderPaid = paidStatuses.includes(order.status);
    const orderProof = !!order.paymentProof || orderPaid;
    this.hasPaid = this.hasPaid || orderPaid;
    this.hasUploadedProof = this.hasUploadedProof || orderProof;
  }
}
