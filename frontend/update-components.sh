#!/bin/bash

# Script to update all category components to use ProductService

# Function to update a component
update_component() {
    local file=$1
    local category_id=$2
    
    echo "Updating $file with category ID: $category_id"
    
    # Create backup
    cp "$file" "${file}.backup"
    
    # Create new component content
    cat > "${file}.new" << INNEREOF
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { ProductService, Product } from '../../service/product/product.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-$(basename $(dirname $file))',
  imports: [RouterModule, CommonModule, SidebarComponent],
  templateUrl: './$(basename $file .ts).html',
  styleUrl: './$(basename $file .ts).css'
})
export class $(basename $(dirname $file) | sed 's/-\([a-z]\)/\U\1/g') implements OnInit {
  products: Product[] = [];
  loading = false;
  currentPage = 1;
  pageSize = 20;
  total = 0;
  totalPages = 0;

  constructor(
    private router: Router,
    private productService: ProductService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    
    // Load products from $category_id category
    const filters = { 
      categoryId: '$category_id',
      isActive: true 
    };

    this.productService.getProducts(this.currentPage, this.pageSize, filters).subscribe({
      next: (response) => {
        this.products = response.products;
        this.total = response.total;
        this.totalPages = response.totalPages;
        this.loading = false;
        console.log('Loaded $category_id products from backend:', response.products);
        console.log('Total products:', response.total);
      },
      error: (error) => {
        console.error('Error loading $category_id products:', error);
        this.toastService.error('Failed to load products');
        this.loading = false;
      }
    });
  }

  // View product details - navigate to product page
  viewProduct(product: Product) {
    console.log('Viewing product:', product);
    this.router.navigate(['/product', product.id]);
  }

  // Pagination methods
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  getProductImage(product: Product): string {
    return product.image || 'https://via.placeholder.com/300x200/cccccc/666666?text=No+Image';
  }

  getProductPrice(product: Product): string {
    return \`\$\${product.price.toFixed(2)}\`;
  }

  isInStock(product: Product): boolean {
    return product.stock > 0;
  }

  getStockStatus(product: Product): string {
    if (product.stock > 10) return 'In Stock';
    if (product.stock > 0) return \`Only \${product.stock} left\`;
    return 'Out of Stock';
  }

  getStockStatusClass(product: Product): string {
    if (product.stock > 10) return 'text-green-600';
    if (product.stock > 0) return 'text-yellow-600';
    return 'text-red-600';
  }
}
INNEREOF

    # Replace the file
    mv "${file}.new" "$file"
}

# Update More Logs components
update_component "src/app/morelogs/usa-banks/usa-banks.ts" "usa-banks"
update_component "src/app/morelogs/uk-banks/uk-banks.ts" "uk-banks"
update_component "src/app/morelogs/canada-banks/canada-banks.ts" "canada-banks"
update_component "src/app/morelogs/usa-cards/usa-cards.ts" "usa-cards"
update_component "src/app/morelogs/uk-cards/uk-cards.ts" "uk-cards"
update_component "src/app/morelogs/europe-cards/europe-cards.ts" "europe-cards"
update_component "src/app/morelogs/africa-cards/africa-cards.ts" "africa-cards"
update_component "src/app/morelogs/canada-cards/canada-cards.ts" "canada-cards"
update_component "src/app/morelogs/australia-cards/australia-cards.ts" "australia-cards"
update_component "src/app/morelogs/credit-unions/credit-unions.ts" "credit-unions"
update_component "src/app/morelogs/crypto-logs/crypto-logs.ts" "crypto-logs"

# Update Linkables components
update_component "src/app/linkable/cashapp/cashapp.ts" "cashapp-linkables"
update_component "src/app/linkable/paypal/paypal.ts" "paypal-linkables"
update_component "src/app/linkable/venmo/venmo.ts" "venmo-linkables"
update_component "src/app/linkable/applepay/applepay.ts" "applepay-linkables"
update_component "src/app/linkable/googlepay/googlepay.ts" "googlepay-linkables"

# Update Transfers components
update_component "src/app/transfers/cashapp/cashapp.ts" "cashapp-transfers"
update_component "src/app/transfers/paypal/paypal.ts" "paypal-transfers"
update_component "src/app/transfers/venmo/venmo.ts" "venmo-transfers"
update_component "src/app/transfers/zelle/zelle.ts" "zelle-transfers"
update_component "src/app/transfers/applepay/applepay.ts" "applepay-transfers"
update_component "src/app/transfers/googlepay/googlepay.ts" "googlepay-transfers"

echo "All components updated!"
