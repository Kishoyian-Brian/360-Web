import { Component, Output, EventEmitter } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent {
  @Output() categoryClicked = new EventEmitter<void>();

  constructor(private router: Router) {}

  categories = [
    { name: 'CC & CVV', route: '/category/cc-cvv' },
    { name: 'BANK LOGS', route: '/category/bank-logs' },
    { name: 'STEALTH ACCOUNTS', route: '/category/stealth-accounts' },
    { name: 'FULLZ', route: '/category/fullz' },
    { name: 'FRAUD GUIDES', route: '/category/fraud-guides' },
    { name: 'TOOLS', route: '/category/tools' },
    { name: 'E-GIFT CARDS', route: '/category/e-gift-cards' },
    { name: 'DEPOSIT CHECKS', route: '/category/deposit-checks' },
    { name: 'TRANSFERS', route: '/category/transfers' },
    { name: 'CLONES', route: '/category/clones' },
    { name: 'CARDED PRODUCTS', route: '/category/carded-products' },
    { name: 'SPAMMING', route: '/category/spamming' },
    { name: 'SHAKEPAY LOG', route: '/category/shake' },
    { name: 'CASHAPP LOG', route: '/category/cashapp-log' },
    { name: 'PAYPAL LOG', route: '/category/paypal-log' },
    { name: 'LINKABLES', route: '/category/linkable' },
    { name: 'BITCOIN LOG', route: '/category/bitcoin-log' }
  ];

  isActiveCategory(route: string): boolean {
    return this.router.url === route;
  }

  onCategoryClick(): void {
    // Emit event to notify parent component to close sidebar on mobile
    this.categoryClicked.emit();
  }
} 