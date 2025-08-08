import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { ProductService, Product } from '../../service/product/product.service';
import { ToastService } from '../../services/toast.service';
import { ProductUtils } from '../../shared/utils/product.utils';

@Component({
  selector: 'app-googlepay',
  imports: [RouterModule, CommonModule, SidebarComponent],
  templateUrl: './googlepay.html',
  styleUrl: './googlepay.css'
})
export class LinkableGooglepay implements OnInit {
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
    
    const filters = { 
      categoryId: 'googlepay-linkables',
      isActive: true 
    };

    this.productService.getProducts(this.currentPage, this.pageSize, filters).subscribe({
      next: (response) => {
        this.products = response.products;
        this.total = response.total;
        this.totalPages = response.totalPages;
        this.loading = false;
        console.log('Loaded googlepay linkables products from backend:', response.products);
      },
      error: (error) => {
        console.error('Error loading googlepay linkables products:', error);
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
}
