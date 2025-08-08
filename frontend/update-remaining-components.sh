#!/bin/bash

# Script to update remaining components to use ProductService

echo "Updating remaining components to use ProductService..."

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
      },
      error: (error) => {
        console.error('Error loading $category_id products:', error);
        this.toastService.error('Failed to load products');
        this.loading = false;
      }
    });
  }

  viewProduct(product: Product) {
    console.log('Viewing product:', product);
    this.router.navigate(['/product', product.id]);
  }

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

# Update remaining category components
update_component "src/app/category/bank-logs/bank-logs.ts" "bank-logs"
update_component "src/app/category/stealth-accounts/stealth-accounts.ts" "stealth-accounts"
update_component "src/app/category/fullz/fullz.ts" "fullz"
update_component "src/app/category/fraud-cards/fraud-cards.ts" "fraud-guides"
update_component "src/app/category/tools/tools.ts" "tools"
update_component "src/app/category/e-gift-cards/e-gift-cards.ts" "e-gift-cards"
update_component "src/app/category/deposit-check/deposit-check.ts" "deposit-checks"
update_component "src/app/category/transfers/transfers.ts" "transfers"
update_component "src/app/category/clone/clone.ts" "clones"
update_component "src/app/category/carded-products/carded-products.ts" "carded-products"
update_component "src/app/category/clips/clips.ts" "spamming"

# Update remaining more logs components
update_component "src/app/morelogs/uk-banks/uk-banks.ts" "uk-banks"
update_component "src/app/morelogs/canada-banks/canada-banks.ts" "canada-banks"
update_component "src/app/morelogs/usa-cards/usa-cards.ts" "usa-cards"
update_component "src/app/morelogs/uk-cards/uk-cards.ts" "uk-cards"
update_component "src/app/morelogs/europe-cards/europe-cards.ts" "europe-cards"
update_component "src/app/morelogs/africa-cards/africa-cards.ts" "africa-cards"
update_component "src/app/morelogs/canada-cards/canada-cards.ts" "canada-cards"
update_component "src/app/morelogs/australia-cards/australia-cards.ts" "australia-cards"

# Update remaining linkables components
update_component "src/app/linkable/paypal/paypal.ts" "paypal-linkables"
update_component "src/app/linkable/venmo/venmo.ts" "venmo-linkables"
update_component "src/app/linkable/applepay/applepay.ts" "applepay-linkables"
update_component "src/app/linkable/googlepay/googlepay.ts" "googlepay-linkables"

# Update remaining transfers components
update_component "src/app/transfers/paypal/paypal.ts" "paypal-transfers"
update_component "src/app/transfers/venmo/venmo.ts" "venmo-transfers"
update_component "src/app/transfers/zelle/zelle.ts" "zelle-transfers"
update_component "src/app/transfers/applepay/applepay.ts" "applepay-transfers"
update_component "src/app/transfers/googlepay/googlepay.ts" "googlepay-transfers"

echo "All remaining components updated!"
echo "Run 'ng build' to test the build."
