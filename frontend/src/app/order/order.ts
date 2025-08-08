import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { OrderService, Order, OrderFilters } from '../service/order/order.service';

@Component({
  selector: 'app-order',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './order.html',
  styleUrl: './order.css'
})
export class OrderComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedOrder: Order | null = null;
  isLoading = false;
  
  // Filter options
  statusFilter = '';
  dateFilter = '';
  searchTerm = '';
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  total = 0;

  constructor(
    public router: Router,
    private toastService: ToastService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    
    const filters: OrderFilters = {};
    if (this.statusFilter) filters.status = this.statusFilter;
    if (this.dateFilter) filters.startDate = this.dateFilter;
    if (this.searchTerm) filters.search = this.searchTerm;

    this.orderService.getOrders(this.currentPage, this.pageSize, filters).subscribe({
      next: (response) => {
        this.orders = response.orders;
        this.filteredOrders = response.orders;
        this.total = response.total;
        this.totalPages = response.totalPages;
        this.isLoading = false;
        console.log('Loaded orders from backend:', response.orders);
        console.log('Total orders:', response.total);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.toastService.error('Failed to load orders');
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    this.currentPage = 1;
    this.loadOrders();
  }

  getCurrentPageOrders(): Order[] {
    return this.filteredOrders;
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadOrders();
    }
  }

  selectOrder(order: Order) {
    this.selectedOrder = order;
  }

  closeOrderDetails() {
    this.selectedOrder = null;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'paid': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-orange-600 bg-orange-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Pending Payment';
      case 'paid': return 'Payment Received';
      case 'processing': return 'Processing Order';
      case 'completed': return 'Order Completed';
      case 'cancelled': return 'Order Cancelled';
      default: return 'Unknown Status';
    }
  }

  clearFilters() {
    this.statusFilter = '';
    this.dateFilter = '';
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadOrders();
  }

  copyOrderId(orderId: string) {
    navigator.clipboard.writeText(orderId).then(() => {
      this.toastService.success('Order ID copied to clipboard!');
    }).catch(() => {
      this.toastService.error('Failed to copy Order ID');
    });
  }

  downloadInvoice(order: Order) {
    this.orderService.downloadInvoice(order.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${order.id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.toastService.success('Invoice downloaded successfully!');
      },
      error: (error) => {
        console.error('Error downloading invoice:', error);
        this.toastService.error('Failed to download invoice');
      }
    });
  }

  reorder(order: Order) {
    this.orderService.reorder(order.id).subscribe({
      next: (response) => {
        this.toastService.success('Items added to cart for reorder!');
        // Refresh cart count in header
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      },
      error: (error) => {
        console.error('Error reordering:', error);
        this.toastService.error('Failed to add items to cart');
      }
    });
  }

  contactSupport(order: Order) {
    this.toastService.info('Opening support chat...');
    console.log('Contacting support for order:', order.id);
  }

  goToShop() {
    this.router.navigate(['/shop']);
  }
}
