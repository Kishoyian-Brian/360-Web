import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-cc-cvv',
  imports: [RouterModule, CommonModule, SidebarComponent],
  templateUrl: './cc-cvv.html',
  styleUrl: './cc-cvv.css'
})
export class CcCvv {
  // CC & CVV products data
  products = [
    {
      id: 'AMEX001',
      name: 'American Express Platinum 5K+ Balance - USA',
      category: 'CC & CVV',
      price: 350.00,
      image: 'https://via.placeholder.com/300x200/1a1a1a/ffffff?text=AMEX+PLATINUM',
      alt: 'American Express Platinum'
    },
    {
      id: 'HSBC001',
      name: 'HSBC Qantas Credit Card 3000+ AUD',
      category: 'CC & CVV',
      price: 200.00,
      image: 'https://via.placeholder.com/300x200/0066cc/ffffff?text=HSBC+QANTAS',
      alt: 'HSBC Qantas'
    },
    {
      id: 'CAN001',
      name: 'Canadian VISA Credits 2500+ CAD Balance',
      category: 'CC & CVV',
      price: 150.00,
      image: 'https://via.placeholder.com/300x200/cc0000/ffffff?text=CANADIAN+VISA',
      alt: 'Canadian VISA'
    }
  ];

  constructor(private router: Router) {}

  // View product details - navigate to product page
  viewProduct(product: any) {
    console.log('Viewing product:', product);
    // Navigate to product details page with product ID
    this.router.navigate(['/product', product.id]);
  }
}
