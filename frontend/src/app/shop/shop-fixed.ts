import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../service/product/product.service';
import { CategoryService, Category } from '../service/category/category.service';
import { ToastService } from '../services/toast.service';
import { ProductUtils } from '../shared/utils/product.utils';

@Component({
  selector: 'app-shop',
  imports: [RouterModule, CommonModule],
  templateUrl: './shop.html',
  styleUrl: './shop.css'
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  loading = false;
  currentPage = 1;
  pageSize = 20;
  total = 0;
  totalPages = 0;

  // Math for template
  Math = Math;

  // Expose ProductUtils to template
  ProductUtils = ProductUtils;

  constructor(
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    // Load ALL categories from backend that admin has added
    this.categoryService.getActiveCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        console.log('Loaded categories from backend:', categories);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.toastService.error('Failed to load categories');
        this.categories = [];
      }
    });
  }

  loadProducts() {
    this.loading = true;
    const filters: any = { isActive: true };

    // Load ALL products from backend that admin has added
    this.productService.getProducts(this.currentPage, this.pageSize, filters).subscribe({
      next: (response) => {
        this.products = response.products;
        this.filteredProducts = response.products;
        this.total = response.total;
        this.totalPages = response.totalPages;
        this.loading = false;
        console.log('Loaded products from backend:', response.products);
        console.log('Total products:', response.total);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.toastService.error('Failed to load products');
        this.loading = false;
      }
    });
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
    this.currentPage = page;
    this.loadProducts();
  }

  goToProduct(productId: string) {
    this.router.navigate(['/product', productId]);
  }

  viewProduct(product: Product) {
    this.router.navigate(['/product', product.id]);
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = Math.min(this.totalPages, 5);
    const startPage = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    const endPage = Math.min(this.totalPages, startPage + maxPages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
} 