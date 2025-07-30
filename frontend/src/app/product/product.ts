import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ToastService } from '../services/toast.service';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  stock: number;
  alt: string;
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product.html',
  styleUrl: './product.css'
})
export class ProductComponent implements OnInit {
  product: Product | null = null;
  quantity: number = 1;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    // Get product ID from route parameter
    this.route.params.subscribe(params => {
      const productId = params['id'];
      if (productId) {
        this.loadProduct(productId);
      } else {
        this.error = 'Product not found';
        this.loading = false;
      }
    });
  }

  goBack() {
    // Use browser history to go back to previous page
    this.location.back();
  }

  loadProduct(productId: string) {
    // Simulate loading product data
    // In a real app, this would be an HTTP call to your backend
    setTimeout(() => {
      // Mock product data - matching the home page data
      const mockProducts: Product[] = [
        {
          id: 'Q8GWKIMO',
          name: 'BITPAY KYC VERIFIED ACCOUNT',
          category: 'STEALTH ACCOUNTS',
          price: 250.00,
          image: 'https://lh3.googleusercontent.com/d/1k4cp-l1nAMSPKBKhn0w48VDt6NypT95P',
          description: 'Fully verified Bitpay account with KYC completed. Ready for immediate use with high limits.',
          stock: 15,
          alt: 'bitpay kyc verified account'
        },
        {
          id: 'PAAR4IHC',
          name: 'Huntington - Bank Login, Balance within $2000 - $5000',
          category: 'BANK LOGS',
          price: 250.00,
          image: 'https://lh3.googleusercontent.com/d/1iVmJ0SXhStmrwyB5vF4wfwuEiva7Mg6h',
          description: 'Premium Huntington bank account with verified balance between $2000-$5000. Full access included.',
          stock: 8,
          alt: 'huntington - bank login, balance within $2000 - $5000'
        },
        {
          id: '0R7UPPNS',
          name: '$1000 Zelle Transfer – USA',
          category: 'TRANSFERS',
          price: 150.00,
          image: 'https://lh3.googleusercontent.com/d/1QbYkJjXQrnDMkJ4bsVkRaByE3Ztse4Lp',
          description: 'Instant $1000 Zelle transfer to any US bank account. Fast and secure transfer service.',
          stock: 25,
          alt: '$1000 zelle transfer – usa'
        },
        {
          id: 'P6PNZZD0',
          name: 'UK VISA [CREDIT] | 3500+ GBP Balance',
          category: 'CC & CVV',
          price: 300.00,
          image: 'https://lh3.googleusercontent.com/d/1Nv_JnokCyePzWwmSuhN-dp6OG_o145eV',
          description: 'UK Visa credit card with over 3500 GBP balance. Includes CVV and full card details.',
          stock: 12,
          alt: 'uk visa [credit] | 3500+ gbp balance'
        },
        {
          id: '1FGZCNY6',
          name: '74,000 INR PayTM Transfer',
          category: 'TRANSFERS',
          price: 285.00,
          image: 'https://lh3.googleusercontent.com/d/1Y8cYcSOOMCN2fepNPE3dULYo1CFPnxCn',
          description: 'Large PayTM transfer of 74,000 INR. Instant transfer to any Indian PayTM account.',
          stock: 5,
          alt: '74,000 inr paytm transfer'
        },
        {
          id: 'QVGW1CE6',
          name: 'National Bank of Canada [CANADA] - Bal [$2,000 - $3,000]',
          category: 'BANK LOGS',
          price: 200.00,
          image: 'https://lh3.googleusercontent.com/d/1oM2X3BQc_SWiGCLi_Nj8WFFG8YLV5lKe',
          description: 'Canadian National Bank account with verified balance between $2000-$3000 CAD.',
          stock: 10,
          alt: 'national bank of canada [canada] - bal [$2,000 - $3,000]'
        },
        {
          id: 'DYALZIK7',
          name: 'Truist Bank - Bal [$5,000 - $7,000]',
          category: 'BANK LOGS',
          price: 300.00,
          image: 'https://lh3.googleusercontent.com/d/1gJiTRiUteXqu_X2GnyoV06rFq-yD3NYU',
          description: 'Premium Truist Bank account with high balance between $5000-$7000. Full access provided.',
          stock: 6,
          alt: 'truist bank - bal [$5,000 - $7,000]'
        },
        {
          id: 'AM8PBE2H',
          name: 'Shakepay Log | 1500+ CAD Balance',
          category: 'SHAKEPAY LOG',
          price: 200.00,
          image: 'https://lh3.googleusercontent.com/d/1NjTURI6mxiP8nl4F-xGV6V4APMJSuFr5',
          description: 'Shakepay cryptocurrency account with over 1500 CAD balance. Ready for crypto transactions.',
          stock: 18,
          alt: 'shakepay log | 1500+ cad balance'
        },
        {
          id: 'HUKELDKS',
          name: 'USA VISA [DEBIT] | $5000+ Balance',
          category: 'CC & CVV',
          price: 450.00,
          image: 'https://lh3.googleusercontent.com/d/17fsF83jmJt6ian0V1YPeZBlpDQuqPZou',
          description: 'High-value USA Visa debit card with over $5000 balance. Includes PIN and full card details.',
          stock: 4,
          alt: 'usa visa [debit] | $5000+ balance'
        },
        {
          id: 'P4RRLWU7',
          name: 'KYC VERIFICATION SOFTWARE - 2FA BYPASS 2023',
          category: 'TOOLS',
          price: 350.00,
          image: 'https://lh3.googleusercontent.com/d/1F_inx7uKIc0xNekRhPauqNh5G-OKy9Ba',
          description: 'Advanced KYC verification software with 2FA bypass capabilities. Latest 2023 version.',
          stock: 20,
          alt: 'kyc verification software - 2fa bypass 2023'
        }
      ];

      const foundProduct = mockProducts.find(p => p.id === productId);
      
      if (foundProduct) {
        this.product = foundProduct;
        this.loading = false;
      } else {
        this.error = 'Product not found';
        this.loading = false;
      }
    }, 500);
  }

  increaseQuantity() {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (!this.product) return;

    const cartItem = {
      id: this.product.id,
      name: this.product.name,
      price: this.product.price,
      quantity: this.quantity,
      image: this.product.image
    };

    // Get existing cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex((item: any) => item.id === this.product!.id);
    
    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart[existingItemIndex].quantity += this.quantity;
      this.toastService.success(`Quantity updated for ${this.product.name.substring(0, 20)}${this.product.name.length > 20 ? '...' : ''}`);
    } else {
      // Add new item
      cart.push(cartItem);
      this.toastService.success(`${this.product.name.substring(0, 20)}${this.product.name.length > 20 ? '...' : ''} added to cart!`);
    }

    // Save back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Dispatch custom event to update header cart count
    window.dispatchEvent(new CustomEvent('cartUpdated', {
      detail: { cartCount: cart.length }
    }));
  }

  get totalPrice(): number {
    return this.product ? this.product.price * this.quantity : 0;
  }
}
