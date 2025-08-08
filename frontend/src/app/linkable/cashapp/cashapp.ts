import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { ProductService, Product } from '../../service/product/product.service';
import { ToastService } from '../../services/toast.service';
import { ProductUtils } from '../../shared/utils/product.utils';

@Component({
  selector: 'app-cashapp',
  imports: [RouterModule, CommonModule, SidebarComponent],
  templateUrl: './cashapp.html',
  styleUrl: './cashapp.css'
})
export class Cashapp implements OnInit {
  products: Product[] = [];
  loading = false;
  currentPage = 1;
  pageSize = 20;
  total = 0;
  totalPages = 0;
  ProductUtils = ProductUtils;

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
    
    // Load products from Cashapp Linkables category
    const filters = { 
      categoryId: 'cashapp-linkables', // This should match the category ID in your backend
      isActive: true 
    };

    this.productService.getProducts(this.currentPage, this.pageSize, filters).subscribe({
      next: (response) => {
        this.products = response.products;
        this.total = response.total;
        this.totalPages = response.totalPages;
        this.loading = false;
        console.log('Loaded Cashapp Linkables products from backend:', response.products);
        console.log('Total products:', response.total);
      },
      error: (error) => {
        console.error('Error loading Cashapp Linkables products:', error);
        this.toastService.error('Failed to load products');
        this.loading = false;
      }
    });
  }

  // View product details - navigate to product page
  viewProduct(product: Product) {
    console.log('Viewing product:', product);
    // Navigate to product details page with product ID
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
}
