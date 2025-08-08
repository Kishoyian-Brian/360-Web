import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  image?: string; // Keep for backward compatibility
  images?: string[]; // Add to match backend response
  stockQuantity: number; // Changed from 'stock' to match backend
  isActive: boolean;
  productType?: string;
  features?: string[];
  balance?: string;
  successRate?: string;
  cardType?: string;
  riskLevel?: string;
  accountType?: string;
  videoType?: string;
  duration?: string;
  quality?: string;
  cloneType?: string;
  compatibility?: string;
  setup?: string;
  delivery?: string;
  checkType?: string;
  amount?: string;
  processing?: string;
  serviceType?: string;
  connection?: string;
  // Additional properties for templates
  alt?: string;
  bankName?: string;
  country?: string;
  verification?: string;
  speed?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stockQuantity: number; // Changed from 'stock' to match backend
  productType?: string;
  image?: string;
  features?: string[];
  balance?: string;
  successRate?: string;
  cardType?: string;
  riskLevel?: string;
  accountType?: string;
  videoType?: string;
  duration?: string;
  quality?: string;
  cloneType?: string;
  compatibility?: string;
  setup?: string;
  delivery?: string;
  checkType?: string;
  amount?: string;
  processing?: string;
  serviceType?: string;
  connection?: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  isActive?: boolean;
}

export interface ProductFilters {
  categoryId?: string;
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isActive?: boolean;
  productType?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get all products with pagination and filters
  getProducts(
    page: number = 1,
    limit: number = 20,
    filters?: ProductFilters
  ): Observable<ProductsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters) {
      if (filters.categoryId) params = params.set('categoryId', filters.categoryId);
      if (filters.categorySlug) params = params.set('categorySlug', filters.categorySlug);
      if (filters.search) params = params.set('search', filters.search);
      if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());
      if (filters.inStock !== undefined) params = params.set('inStock', filters.inStock.toString());
      if (filters.isActive !== undefined) params = params.set('isActive', filters.isActive.toString());
      if (filters.productType) params = params.set('productType', filters.productType);
    }

    return this.http.get<ProductsResponse>(`${this.API_URL}/products`, { params });
  }

  // Get products by category
  getProductsByCategory(categoryId: string, page: number = 1, limit: number = 20): Observable<ProductsResponse> {
    return this.getProducts(page, limit, { categoryId });
  }

  // Get a single product by ID
  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/products/${id}`);
  }

  // Create a new product (Admin only)
  createProduct(productData: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(`${this.API_URL}/products`, productData);
  }

  // Update a product (Admin only)
  updateProduct(id: string, productData: UpdateProductRequest): Observable<Product> {
    return this.http.patch<Product>(`${this.API_URL}/products/${id}`, productData);
  }

  // Delete a product (Admin only)
  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/products/${id}`);
  }

  // Upload product image (Admin only)
  uploadProductImage(productId: string, file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image');
    formData.append('folder', 'products');

    return this.http.post<{ imageUrl: string }>(`${this.API_URL}/upload/image`, formData);
  }

  // Get featured products (for home page)
  getFeaturedProducts(limit: number = 8): Observable<Product[]> {
    return this.getProducts(1, limit, { isActive: true }).pipe(
      map(response => response.products)
    );
  }

  // Search products
  searchProducts(query: string, page: number = 1, limit: number = 20): Observable<ProductsResponse> {
    return this.getProducts(page, limit, { search: query });
  }

  // Get products in stock
  getInStockProducts(page: number = 1, limit: number = 20): Observable<ProductsResponse> {
    return this.getProducts(page, limit, { inStock: true, isActive: true });
  }

  // Get products by price range
  getProductsByPriceRange(minPrice: number, maxPrice: number, page: number = 1, limit: number = 20): Observable<ProductsResponse> {
    return this.getProducts(page, limit, { minPrice, maxPrice, isActive: true });
  }

  // Get products by type
  getProductsByType(productType: string, page: number = 1, limit: number = 20): Observable<ProductsResponse> {
    return this.getProducts(page, limit, { productType, isActive: true });
  }

  // Bulk operations (Admin only)
  bulkUpdateProducts(productIds: string[], updates: Partial<UpdateProductRequest>): Observable<{ message: string; updatedCount: number }> {
    return this.http.patch<{ message: string; updatedCount: number }>(`${this.API_URL}/products/bulk-update`, {
      productIds,
      updates
    });
  }

  bulkDeleteProducts(productIds: string[]): Observable<{ message: string; deletedCount: number }> {
    return this.http.delete<{ message: string; deletedCount: number }>(`${this.API_URL}/products/bulk-delete`, {
      body: { productIds }
    });
  }

  // Get product statistics (Admin only)
  getProductStats(): Observable<{
    totalProducts: number;
    activeProducts: number;
    outOfStockProducts: number;
    totalValue: number;
    averagePrice: number;
  }> {
    return this.http.get<{
      totalProducts: number;
      activeProducts: number;
      outOfStockProducts: number;
      totalValue: number;
      averagePrice: number;
    }>(`${this.API_URL}/products/stats`);
  }
} 