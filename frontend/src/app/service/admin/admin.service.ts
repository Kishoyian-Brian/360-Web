import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  isActive: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface UserFilterDto {
  search?: string;
  role?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

// Order interfaces
export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: {
    username: string;
    email: string;
  };
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  shippingAddress: any;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilterDto {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
  orderNumber?: string;
  paymentMethod?: string;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // User Management
  getUsers(filters?: UserFilterDto): Observable<UsersResponse> {
    const params: any = {};
    if (filters) {
      if (filters.search) params.search = filters.search;
      if (filters.role) params.role = filters.role;
      if (filters.isActive !== undefined) params.isActive = filters.isActive;
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;
    }

    return this.http.get<UsersResponse>(`${this.API_URL}/users`, {
      headers: this.authService.getAuthHeaders(),
      params
    });
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/users/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateUserRole(userId: string, role: string): Observable<User> {
    return this.http.patch<User>(`${this.API_URL}/users/${userId}/role`, 
      { role }, 
      { headers: this.authService.getAuthHeaders() }
    );
  }

  toggleUserStatus(userId: string, isActive: boolean): Observable<User> {
    return this.http.patch<User>(`${this.API_URL}/users/${userId}/status`, 
      { isActive }, 
      { headers: this.authService.getAuthHeaders() }
    );
  }

  deleteUser(userId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/users/${userId}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Order Management
  getOrders(filters?: OrderFilterDto): Observable<OrdersResponse> {
    const params: any = {};
    if (filters) {
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;
      if (filters.status) params.status = filters.status;
      if (filters.paymentStatus) params.paymentStatus = filters.paymentStatus;
      if (filters.orderNumber) params.orderNumber = filters.orderNumber;
      if (filters.paymentMethod) params.paymentMethod = filters.paymentMethod;
    }

    return this.http.get<OrdersResponse>(`${this.API_URL}/orders`, {
      headers: this.authService.getAuthHeaders(),
      params
    });
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.API_URL}/orders/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateOrderStatus(orderId: string, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.API_URL}/orders/${orderId}/status`, 
      { status }, 
      { headers: this.authService.getAuthHeaders() }
    );
  }

  updatePaymentStatus(orderId: string, paymentStatus: string): Observable<Order> {
    return this.http.patch<Order>(`${this.API_URL}/orders/${orderId}/payment-status`, 
      { paymentStatus }, 
      { headers: this.authService.getAuthHeaders() }
    );
  }

  getOrderStats(): Observable<OrderStats> {
    return this.http.get<OrderStats>(`${this.API_URL}/orders/stats`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  deleteOrder(orderId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/orders/${orderId}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
