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
  balance: number;
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
  paymentProof?: string;
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
  private readonly API_URL = 'https://three60-web-gzzw.onrender.com/api';

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
      if (filters.page) params.page = filters.page.toString();
      if (filters.limit) params.limit = filters.limit.toString();
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
      if (filters.page) params.page = filters.page.toString();
      if (filters.limit) params.limit = filters.limit.toString();
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

  // Balance Management
  updateUserBalance(userId: string, amount: number, type: string, reason: string, referenceId?: string, referenceType?: string): Observable<User> {
    const request = {
      amount,
      type,
      reason,
      referenceId,
      referenceType
    };
    
    return this.http.patch<User>(`${this.API_URL}/users/${userId}/balance`, request, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getUserBalance(userId: string): Observable<{ balance: number }> {
    return this.http.get<{ balance: number }>(`${this.API_URL}/users/${userId}/balance`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getUserBalanceHistory(userId: string, page: number = 1, limit: number = 10): Observable<{
    history: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    const params = { page: page.toString(), limit: limit.toString() };
    
    return this.http.get<{
      history: any[];
      total: number;
      page: number;
      limit: number;
    }>(`${this.API_URL}/users/${userId}/balance-history`, {
      headers: this.authService.getAuthHeaders(),
      params
    });
  }

  // Payment Management with Balance Update
  updatePaymentStatusWithBalance(paymentId: string, status: string): Observable<any> {
    return this.http.patch<any>(`${this.API_URL}/payments/${paymentId}/status`, 
      { status }, 
      { headers: this.authService.getAuthHeaders() }
    );
  }

  // Topup Management
  getTopups(filters?: any): Observable<{
    topups: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.http.get<{
      topups: any[];
      total: number;
      page: number;
      limit: number;
    }>(`${this.API_URL}/topups`, { 
      params: filters,
      headers: this.authService.getAuthHeaders() 
    });
  }

  getTopupStats(): Observable<{
    totalRequests: number;
    pendingRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
  }> {
    return this.http.get<{
      totalRequests: number;
      pendingRequests: number;
      approvedRequests: number;
      rejectedRequests: number;
    }>(`${this.API_URL}/topups/stats`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  approveTopup(topupId: string, notes?: string): Observable<any> {
    return this.http.patch<any>(`${this.API_URL}/topups/${topupId}/approve`, 
      { notes }, 
      { headers: this.authService.getAuthHeaders() }
    );
  }
  
  rejectTopup(topupId: string, notes?: string): Observable<any> {
    return this.http.patch<any>(`${this.API_URL}/topups/${topupId}/reject`, 
      { notes }, 
      { headers: this.authService.getAuthHeaders() }
    );
  }
  
  deleteTopup(topupId: string): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/topups/${topupId}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
