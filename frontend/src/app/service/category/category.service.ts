import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesResponse {
  categories: Category[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CategoryFilters {
  search?: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Get all categories with pagination and filters
  getCategories(
    page: number = 1,
    limit: number = 50,
    filters?: CategoryFilters
  ): Observable<CategoriesResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.isActive !== undefined) params = params.set('isActive', filters.isActive.toString());
    }

    return this.http.get<CategoriesResponse>(`${this.API_URL}/categories`, { params });
  }

  // Get all active categories (for dropdowns, filters, etc.)
  getActiveCategories(): Observable<Category[]> {
    return this.getCategories(1, 100, { isActive: true }).pipe(
      map(response => response.categories)
    );
  }

  // Get a single category by ID
  getCategory(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.API_URL}/categories/${id}`);
  }

  // Create a new category (Admin only)
  createCategory(categoryData: { name: string; description?: string }): Observable<Category> {
    return this.http.post<Category>(`${this.API_URL}/categories`, categoryData);
  }

  // Update a category (Admin only)
  updateCategory(id: string, categoryData: Partial<Category>): Observable<Category> {
    return this.http.patch<Category>(`${this.API_URL}/categories/${id}`, categoryData);
  }

  // Delete a category (Admin only)
  deleteCategory(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/categories/${id}`);
  }

  // Toggle category status (Admin only)
  toggleCategoryStatus(id: string, isActive: boolean): Observable<Category> {
    return this.http.patch<Category>(`${this.API_URL}/categories/${id}`, { isActive });
  }

  // Search categories
  searchCategories(query: string, page: number = 1, limit: number = 20): Observable<CategoriesResponse> {
    return this.getCategories(page, limit, { search: query });
  }

  // Get category statistics (Admin only)
  getCategoryStats(): Observable<{
    totalCategories: number;
    activeCategories: number;
    inactiveCategories: number;
    categoriesWithProducts: number;
  }> {
    return this.http.get<{
      totalCategories: number;
      activeCategories: number;
      inactiveCategories: number;
      categoriesWithProducts: number;
    }>(`${this.API_URL}/categories/stats`);
  }
} 