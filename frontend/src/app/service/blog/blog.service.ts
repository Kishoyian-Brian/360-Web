import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string; // Changed from string[] to string to match backend
  viewCount: number;
  isFeatured: boolean;
  publishedAt?: string;
  authorId: string;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  tags?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  commentsCount: number;
}

export interface CreateBlogPostDto {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string; // Changed from string[] to string to match backend
  isFeatured: boolean;
  publishedAt?: string;
  categoryId?: string;
  tagIds?: string[];
}

export interface UpdateBlogPostDto {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string; // Changed from string[] to string to match backend
  isFeatured?: boolean;
  publishedAt?: string;
  categoryId?: string;
  viewCount?: number;
}

export interface BlogFilterDto {
  search?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  categoryId?: string;
  categorySlug?: string;
  tagId?: string;
  tagSlug?: string;
  authorId?: string;
  isFeatured?: boolean;
  year?: number;
  month?: number;
  page?: number;
  limit?: number;
  sortBy?: 'title' | 'createdAt' | 'publishedAt' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
}

export interface BlogResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  limit: number;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  order: number;
  _count?: {
    posts: number;
  };
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  _count?: {
    posts: number;
  };
}

export interface BlogComment {
  id: string;
  content: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  postId: string;
  userId: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
  };
  replies?: BlogComment[];
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private readonly API_URL = `${environment.apiUrl}/blog`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Public read operations (no auth required)
  getBlogPosts(filterDto: BlogFilterDto = {}): Observable<BlogResponse> {
    let params = new HttpParams();
    Object.keys(filterDto).forEach(key => {
      const value = (filterDto as any)[key];
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });
    return this.http.get<BlogResponse>(`${this.API_URL}/posts`, { params });
  }

  getBlogPostById(id: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.API_URL}/posts/${id}`);
  }

  getBlogPostBySlug(slug: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.API_URL}/posts/slug/${slug}`);
  }

  // Admin operations (auth required)
  createBlogPost(createBlogPostDto: CreateBlogPostDto): Observable<BlogPost> {
    return this.http.post<BlogPost>(`${this.API_URL}/posts`, createBlogPostDto, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateBlogPost(id: string, updateBlogPostDto: UpdateBlogPostDto): Observable<BlogPost> {
    return this.http.put<BlogPost>(`${this.API_URL}/posts/${id}`, updateBlogPostDto, {
      headers: this.authService.getAuthHeaders()
    });
  }

  deleteBlogPost(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/posts/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Category operations (auth required for admin operations)
  getBlogCategories(): Observable<BlogCategory[]> {
    return this.http.get<BlogCategory[]>(`${this.API_URL}/categories`);
  }

  createBlogCategory(data: { name: string; slug: string; description?: string; parentId?: string }): Observable<BlogCategory> {
    return this.http.post<BlogCategory>(`${this.API_URL}/categories`, data, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Tag operations (auth required for admin operations)
  getBlogTags(): Observable<BlogTag[]> {
    return this.http.get<BlogTag[]>(`${this.API_URL}/tags`);
  }

  createBlogTag(data: { name: string; slug: string; description?: string }): Observable<BlogTag> {
    return this.http.post<BlogTag>(`${this.API_URL}/tags`, data, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Comment operations (auth required for admin operations)
  getBlogComments(postId: string): Observable<BlogComment[]> {
    return this.http.get<BlogComment[]>(`${this.API_URL}/posts/${postId}/comments`);
  }

  createBlogComment(postId: string, data: { content: string; parentId?: string }): Observable<BlogComment> {
    return this.http.post<BlogComment>(`${this.API_URL}/posts/${postId}/comments`, data, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Public read operations (no auth required)
  getFeaturedPosts(limit: number = 5): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`${this.API_URL}/posts/featured?limit=${limit}`);
  }

  getPopularPosts(limit: number = 5): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`${this.API_URL}/posts/popular?limit=${limit}`);
  }

  searchBlogPosts(query: string, page: number = 1, limit: number = 10): Observable<BlogResponse> {
    const params = new HttpParams()
      .set('search', query)
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<BlogResponse>(`${this.API_URL}/posts/search`, { params });
  }

  getBlogPostsByCategory(slug: string, page: number = 1, limit: number = 10): Observable<BlogResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<BlogResponse>(`${this.API_URL}/categories/${slug}/posts`, { params });
  }

  getBlogPostsByTag(slug: string, page: number = 1, limit: number = 10): Observable<BlogResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<BlogResponse>(`${this.API_URL}/tags/${slug}/posts`, { params });
  }

  // Legacy methods for backward compatibility
  getArticles(page: number = 1, limit: number = 12, filters?: any): Observable<BlogResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key];
        if (value !== undefined && value !== null) {
          params = params.set(key, value.toString());
        }
        });
    }

    return this.http.get<BlogResponse>(`${this.API_URL}/posts`, { params });
  }

  getArticle(idOrSlug: string): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.API_URL}/posts/${idOrSlug}`);
  }

  getArticlesByCategory(category: string, page: number = 1, limit: number = 12): Observable<BlogResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<BlogResponse>(`${this.API_URL}/categories/${category}/posts`, { params });
  }

  searchArticles(query: string, page: number = 1, limit: number = 12): Observable<BlogResponse> {
    const params = new HttpParams()
      .set('search', query)
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<BlogResponse>(`${this.API_URL}/posts/search`, { params });
  }

  getFeaturedArticles(limit: number = 6): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`${this.API_URL}/posts/featured?limit=${limit}`);
  }

  getRecentArticles(limit: number = 5): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`${this.API_URL}/posts/recent?limit=${limit}`);
  }

  getCategories(): Observable<BlogCategory[]> {
    return this.http.get<BlogCategory[]>(`${this.API_URL}/categories`);
  }

  getTags(): Observable<BlogTag[]> {
    return this.http.get<BlogTag[]>(`${this.API_URL}/tags`);
  }

  // Admin operations (auth required)
  createArticle(articleData: Partial<BlogPost>): Observable<BlogPost> {
    return this.http.post<BlogPost>(`${this.API_URL}/posts`, articleData, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateArticle(id: string, articleData: Partial<BlogPost>): Observable<BlogPost> {
    return this.http.put<BlogPost>(`${this.API_URL}/posts/${id}`, articleData, {
      headers: this.authService.getAuthHeaders()
    });
  }

  deleteArticle(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/posts/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  togglePublishStatus(id: string, isPublished: boolean): Observable<BlogPost> {
    return this.http.patch<BlogPost>(`${this.API_URL}/posts/${id}/publish`, { isPublished }, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
