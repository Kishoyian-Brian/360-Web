import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled';
  bitcoinAddress: string;
  paymentProof?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  bitcoinAddress: string;
}

export interface UpdateOrderRequest {
  status?: string;
  paymentProof?: string;
  notes?: string;
}

export interface OrderFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Get user's orders with pagination and filters
  getOrders(
    page: number = 1,
    limit: number = 10,
    filters?: OrderFilters
  ): Observable<OrdersResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.startDate) params = params.set('startDate', filters.startDate);
      if (filters.endDate) params = params.set('endDate', filters.endDate);
      if (filters.search) params = params.set('search', filters.search);
    }

    return this.http.get<OrdersResponse>(`${this.API_URL}/orders`, { params });
  }

  // Get a single order by ID
  getOrder(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.API_URL}/orders/${orderId}`);
  }

  // Create a new order from cart
  createOrder(request: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(`${this.API_URL}/orders`, request);
  }

  // Update order (for payment proof, status changes, etc.)
  updateOrder(orderId: string, request: UpdateOrderRequest): Observable<Order> {
    return this.http.patch<Order>(`${this.API_URL}/orders/${orderId}`, request);
  }

  // Submit payment proof
  submitPaymentProof(orderId: string, paymentProofFile: File): Observable<Order> {
    const formData = new FormData();
    formData.append('paymentProof', paymentProofFile);
    
    return this.http.post<Order>(`${this.API_URL}/orders/${orderId}/payment-proof`, formData);
  }

  // Cancel order
  cancelOrder(orderId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/orders/${orderId}`);
  }

  // Get order statistics
  getOrderStats(): Observable<{
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalSpent: number;
    averageOrderValue: number;
  }> {
    return this.http.get<{
      totalOrders: number;
      pendingOrders: number;
      completedOrders: number;
      totalSpent: number;
      averageOrderValue: number;
    }>(`${this.API_URL}/orders/stats`);
  }

  // Download invoice
  downloadInvoice(orderId: string): Observable<Blob> {
    return this.http.get(`${this.API_URL}/orders/${orderId}/invoice`, {
      responseType: 'blob'
    });
  }

  // Reorder (add items from order to cart)
  reorder(orderId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/orders/${orderId}/reorder`, {});
  }
}
