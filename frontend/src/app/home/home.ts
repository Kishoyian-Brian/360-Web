import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  // Featured products data (will be moved to a service later)
  featuredProducts = [
    {
      id: 'Q8GWKIMO',
      name: 'BITPAY KYC VERIFIED ACCOUNT',
      category: 'STEALTH ACCOUNTS',
      price: 250.00,
      image: 'https://lh3.googleusercontent.com/d/1k4cp-l1nAMSPKBKhn0w48VDt6NypT95P',
      alt: 'bitpay kyc verified account'
    },
    {
      id: 'PAAR4IHC',
      name: 'Huntington - Bank Login, Balance within $2000 - $5000',
      category: 'BANK LOGS',
      price: 250.00,
      image: 'https://lh3.googleusercontent.com/d/1iVmJ0SXhStmrwyB5vF4wfwuEiva7Mg6h',
      alt: 'huntington - bank login, balance within $2000 - $5000'
    },
    {
      id: '0R7UPPNS',
      name: '$1000 Zelle Transfer – USA',
      category: 'TRANSFERS',
      price: 150.00,
      image: 'https://lh3.googleusercontent.com/d/1QbYkJjXQrnDMkJ4bsVkRaByE3Ztse4Lp',
      alt: '$1000 zelle transfer – usa'
    },
    {
      id: 'P6PNZZD0',
      name: 'UK VISA [CREDIT] | 3500+ GBP Balance',
      category: 'CC & CVV',
      price: 300.00,
      image: 'https://lh3.googleusercontent.com/d/1Nv_JnokCyePzWwmSuhN-dp6OG_o145eV',
      alt: 'uk visa [credit] | 3500+ gbp balance'
    },
    {
      id: '1FGZCNY6',
      name: '74,000 INR PayTM Transfer',
      category: 'TRANSFERS',
      price: 285.00,
      image: 'https://lh3.googleusercontent.com/d/1Y8cYcSOOMCN2fepNPE3dULYo1CFPnxCn',
      alt: '74,000 inr paytm transfer'
    },
    {
      id: 'QVGW1CE6',
      name: 'National Bank of Canada [CANADA] - Bal [$2,000 - $3,000]',
      category: 'BANK LOGS',
      price: 200.00,
      image: 'https://lh3.googleusercontent.com/d/1oM2X3BQc_SWiGCLi_Nj8WFFG8YLV5lKe',
      alt: 'national bank of canada [canada] - bal [$2,000 - $3,000]'
    },
    {
      id: 'DYALZIK7',
      name: 'Truist Bank - Bal [$5,000 - $7,000]',
      category: 'BANK LOGS',
      price: 300.00,
      image: 'https://lh3.googleusercontent.com/d/1gJiTRiUteXqu_X2GnyoV06rFq-yD3NYU',
      alt: 'truist bank - bal [$5,000 - $7,000]'
    },
    {
      id: 'AM8PBE2H',
      name: 'Shakepay Log | 1500+ CAD Balance',
      category: 'SHAKEPAY LOG',
      price: 200.00,
      image: 'https://lh3.googleusercontent.com/d/1NjTURI6mxiP8nl4F-xGV6V4APMJSuFr5',
      alt: 'shakepay log | 1500+ cad balance'
    },
    {
      id: 'HUKELDKS',
      name: 'USA VISA [DEBIT] | $5000+ Balance',
      category: 'CC & CVV',
      price: 450.00,
      image: 'https://lh3.googleusercontent.com/d/17fsF83jmJt6ian0V1YPeZBlpDQuqPZou',
      alt: 'usa visa [debit] | $5000+ balance'
    },
    {
      id: 'P4RRLWU7',
      name: 'KYC VERIFICATION SOFTWARE - 2FA BYPASS 2023',
      category: 'TOOLS',
      price: 350.00,
      image: 'https://lh3.googleusercontent.com/d/1F_inx7uKIc0xNekRhPauqNh5G-OKy9Ba',
      alt: 'kyc verification software - 2fa bypass 2023'
    }
  ];

  // Notice message
  noticeMessage = "NOTICE: All orders and payments must be made through our website or to our telegram support @charley_707 ONLY. Avoid paying to any third-party user claiming to represent us.";

  constructor(private router: Router) {}

  // Add to cart functionality (will be connected to cart service later)
  addToCart(product: any) {
    console.log('Adding to cart:', product);
    // TODO: Implement cart service integration
  }

  // View product details - navigate to product page
  viewProduct(product: any) {
    console.log('Viewing product:', product);
    // Navigate to product details page with product ID
    this.router.navigate(['/product', product.id]);
  }
}
