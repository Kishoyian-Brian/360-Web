import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { CartService, Cart } from '../../service/cart/cart.service';
import { OrderService, Order, CreateOrderRequest } from '../../service/order/order.service';

interface CryptoPayment {
  name: string;
  symbol: string;
  address: string;
  network?: string;
}

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

  // Cryptocurrency payment options
  cryptoPayments: CryptoPayment[] = [
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      address: 'TKieHKDKegGjW2HojHxKgsNkZAota5CuDz'
    },
    {
      name: 'USDT',
      symbol: 'USDT',
      address: '0x3C774Adef37D1D6ee2180D7845AE7020e5d79B29',
      network: 'TRC20'
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      address: 'LdLygre8cKg7ak1tk3LTFTkTtBbhiUiCQn'
    },
    {
      name: 'Litecoin',
      symbol: 'LTC',
      address: 'LdLygre8cKg7ak1tk3LTFTkTtBbhiUiCQn'
    }
  ];

  selectedCrypto: CryptoPayment = this.cryptoPayments[0]; // Default to Bitcoin
  cryptoAmount = 0;
  orderId = '';

  constructor(
    private router: Router,
    private toastService: ToastService,
    private cartService: CartService,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.cryptoAmount = cart.total;
        this.isLoading = false;
        console.log('Loaded cart from backend:', cart);
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.toastService.error('Failed to load cart');
        this.isLoading = false;
        this.router.navigate(['/cart']);
      }
    });
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
      bitcoinAddress: this.selectedCrypto.address // Keep for backward compatibility
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

  selectCryptoPayment(crypto: CryptoPayment) {
    this.selectedCrypto = crypto;
  }

  copyCryptoAddress() {
    navigator.clipboard.writeText(this.selectedCrypto.address).then(() => {
      this.toastService.success(`${this.selectedCrypto.name} address copied to clipboard!`);
    }).catch(() => {
      this.toastService.error('Failed to copy address');
    });
  }

  getCryptoDisplayName(crypto: CryptoPayment): string {
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
}
