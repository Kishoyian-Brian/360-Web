import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { CartService, Cart, CartItem } from '../../service/cart/cart.service';
import { OrderService, Order, CreateOrderRequest } from '../../service/order/order.service';
import { ProductService } from '../../service/product/product.service';
import { CryptoService, CryptoAccount, CreateCryptoAccountRequest } from '../../service/crypto/crypto.service';
import { AuthService } from '../../service/auth/auth.service';

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
  
  // Admin crypto management
  showAdminPanel = false;
  isCreatingAccount = false;
  isEditingAccount = false;
  editingAccountId: string | null = null;
  newCryptoAccount: CreateCryptoAccountRequest = {
    name: '',
    symbol: '',
    address: '',
    network: '',
    isActive: true,
    order: 0,
    description: ''
  };
  cryptoAmount = 0;
  orderId = '';

  constructor(
    private router: Router,
    private toastService: ToastService,
    private cartService: CartService,
    private orderService: OrderService,
    private productService: ProductService,
    public cryptoService: CryptoService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadCart();
    this.loadCryptoAccounts();
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
              image: product.images && product.images.length > 0 ? product.images[0] : undefined,
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
    }
  }

  createOrder() {
    if (!this.cart || this.cart.items.length === 0) {
      this.toastService.error('Your cart is empty!');
      this.router.navigate(['/cart']);
      return;
    }

    this.isLoading = true;
    const orderRequest: CreateOrderRequest = {
      items: this.cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      })),
      bitcoinAddress: this.selectedCrypto?.address || '' // Keep for backward compatibility
    };

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
      },
      error: (error) => {
        console.error('Error loading crypto accounts:', error);
        this.toastService.error('Failed to load payment methods');
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

  // Admin methods
  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  toggleAdminPanel() {
    this.showAdminPanel = !this.showAdminPanel;
    if (this.showAdminPanel) {
      this.loadAllCryptoAccounts();
    }
  }

  loadAllCryptoAccounts() {
    this.cryptoService.getAllAccounts().subscribe({
      next: (accounts) => {
        // This will update the cryptoAccounts$ observable
        console.log('Loaded all crypto accounts for admin:', accounts);
      },
      error: (error) => {
        console.error('Error loading all crypto accounts:', error);
        this.toastService.error('Failed to load crypto accounts');
      }
    });
  }

  startCreatingAccount() {
    this.isCreatingAccount = true;
    this.isEditingAccount = false;
    this.editingAccountId = null;
    this.resetForm();
  }

  startEditingAccount(account: CryptoAccount) {
    this.isEditingAccount = true;
    this.isCreatingAccount = false;
    this.editingAccountId = account.id;
    this.newCryptoAccount = {
      name: account.name,
      symbol: account.symbol,
      address: account.address,
      network: account.network || '',
      isActive: account.isActive,
      order: account.order,
      description: account.description || ''
    };
  }

  saveAccount() {
    if (this.isCreatingAccount) {
      this.createAccount();
    } else if (this.isEditingAccount && this.editingAccountId) {
      this.updateAccount();
    }
  }

  createAccount() {
    if (!this.validateForm()) return;

    this.cryptoService.createAccount(this.newCryptoAccount).subscribe({
      next: (account) => {
        this.toastService.success('Crypto account created successfully!');
        this.cancelEdit();
        this.loadCryptoAccounts(); // Refresh active accounts
        console.log('Created crypto account:', account);
      },
      error: (error) => {
        console.error('Error creating crypto account:', error);
        this.toastService.error('Failed to create crypto account');
      }
    });
  }

  updateAccount() {
    if (!this.validateForm() || !this.editingAccountId) return;

    this.cryptoService.updateAccount(this.editingAccountId, this.newCryptoAccount).subscribe({
      next: (account) => {
        this.toastService.success('Crypto account updated successfully!');
        this.cancelEdit();
        this.loadCryptoAccounts(); // Refresh active accounts
        console.log('Updated crypto account:', account);
      },
      error: (error) => {
        console.error('Error updating crypto account:', error);
        this.toastService.error('Failed to update crypto account');
      }
    });
  }

  deleteAccount(accountId: string, accountName: string) {
    if (!confirm(`Are you sure you want to delete the ${accountName} account? This action cannot be undone.`)) {
      return;
    }

    this.cryptoService.deleteAccount(accountId).subscribe({
      next: () => {
        this.toastService.success('Crypto account deleted successfully!');
        this.loadCryptoAccounts(); // Refresh active accounts
      },
      error: (error) => {
        console.error('Error deleting crypto account:', error);
        this.toastService.error('Failed to delete crypto account');
      }
    });
  }

  cancelEdit() {
    this.isCreatingAccount = false;
    this.isEditingAccount = false;
    this.editingAccountId = null;
    this.resetForm();
  }

  resetForm() {
    this.newCryptoAccount = {
      name: '',
      symbol: '',
      address: '',
      network: '',
      isActive: true,
      order: 0,
      description: ''
    };
  }

  validateForm(): boolean {
    if (!this.newCryptoAccount.name.trim()) {
      this.toastService.error('Please enter a name');
      return false;
    }
    if (!this.newCryptoAccount.symbol.trim()) {
      this.toastService.error('Please enter a symbol');
      return false;
    }
    if (!this.newCryptoAccount.address.trim()) {
      this.toastService.error('Please enter an address');
      return false;
    }
    return true;
  }

  seedDefaultAccounts() {
    if (!confirm('This will create default crypto accounts if they don\'t exist. Continue?')) {
      return;
    }

    this.cryptoService.seedDefaultAccounts().subscribe({
      next: (response) => {
        this.toastService.success(response.message);
        this.loadCryptoAccounts();
      },
      error: (error) => {
        console.error('Error seeding accounts:', error);
        this.toastService.error('Failed to seed default accounts');
      }
    });
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

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.paymentProofPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removePaymentProof() {
    this.paymentProofFile = null;
    this.paymentProofPreview = null;
  }

  submitPaymentProof() {
    if (!this.paymentProofFile || !this.order) {
      this.toastService.error('Please select a payment proof image');
      return;
    }

    this.isSubmittingPayment = true;

    this.orderService.submitPaymentProof(this.order.id, this.paymentProofFile).subscribe({
      next: (updatedOrder) => {
        this.order = updatedOrder;
        this.isSubmittingPayment = false;
        this.toastService.success('Payment proof submitted successfully! We will verify your payment shortly.');
        console.log('Payment proof submitted:', updatedOrder);
      },
      error: (error) => {
        console.error('Error submitting payment proof:', error);
        this.toastService.error('Failed to submit payment proof');
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
      return item.image;
    }
    return 'https://via.placeholder.com/64x64/cccccc/666666?text=No+Image';
  }
}
