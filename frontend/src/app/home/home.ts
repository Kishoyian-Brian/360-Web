import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService, Product } from '../service/product/product.service';
import { CategoryService, Category } from '../service/category/category.service';
import { CartService } from '../service/cart/cart.service';
import { ToastService } from '../services/toast.service';
import { ProductUtils } from '../shared/utils/product.utils';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  // Products data
  products: Product[] = [];
  categories: Category[] = [];
  
  // Pagination
  currentPage = 1;
  pageSize = 20;
  total = 0;
  totalPages = 0;
  
  // Loading states
  loading = false;
  loadingCategories = false;
  
  // Filters
  selectedCategory = '';
  searchTerm = '';
  
  // Notice message
  noticeMessage = "NOTICE: All orders and payments must be made through our website or to our telegram support @Charlie_7O ONLY. Avoid paying to any third-party user claiming to represent us.";

  // Math for template
  Math = Math;

  // Expose ProductUtils to template
  ProductUtils = ProductUtils;

  constructor(
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.loadingCategories = true;
    this.categoryService.getActiveCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loadingCategories = false;
        console.log('Loaded categories for home:', categories);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.toastService.error('Failed to load categories');
        this.loadingCategories = false;
        this.categories = [];
      }
    });
  }

  loadProducts() {
    this.loading = true;
    
    const filters: any = { isActive: true };
    
    if (this.selectedCategory) {
      filters.categoryId = this.selectedCategory;
    }
    
    if (this.searchTerm) {
      filters.search = this.searchTerm;
    }

    this.productService.getProducts(this.currentPage, this.pageSize, filters).subscribe({
      next: (response) => {
        this.products = response.products;
        this.total = response.total;
        this.totalPages = response.totalPages;
        this.loading = false;
        console.log('Loaded products for home:', response.products);
        console.log('Total products:', response.total);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.toastService.error('Failed to load products');
        this.loading = false;
      }
    });
  }

  // Filter by category
  filterByCategory(categoryId: string) {
    this.selectedCategory = categoryId;
    this.currentPage = 1;
    this.loadProducts();
  }

  // Search products
  searchProducts() {
    this.currentPage = 1;
    this.loadProducts();
  }

  // Clear filters
  clearFilters() {
    this.selectedCategory = '';
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadProducts();
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

  // Add to cart functionality
  addToCart(product: Product) {
    console.log('Adding to cart:', product);
    this.cartService.addToCart({ productId: product.id, quantity: 1 }).subscribe({
      next: (cart) => {
        this.toastService.success('Product added to cart successfully!');
        console.log('Cart updated:', cart);
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        this.toastService.error('Failed to add product to cart');
      }
    });
  }

  // View product details
  viewProduct(product: Product) {
    console.log('Viewing product:', product);
    this.router.navigate(['/product', product.id]);
  }

  get pageNumbers() {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}
