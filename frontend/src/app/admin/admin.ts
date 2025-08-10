import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../service/auth/auth.service';
import { AdminService, Order, OrderFilterDto, OrderStats } from '../service/admin/admin.service';
import { ToastService } from '../services/toast.service';
import { BlogService, BlogPost, CreateBlogPostDto, UpdateBlogPostDto, BlogCategory, BlogTag } from '../service/blog/blog.service';
import { VouchService, Vouch, CreateVouchDto, UpdateVouchDto, VouchResponse, VouchStats } from '../service/vouch/vouch.service';
import { CryptoService, CryptoAccount, CreateCryptoAccountRequest } from '../service/crypto/crypto.service';
import { UserService } from '../service/user/user';

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
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stockQuantity: number;
  productType: string;
  images?: string[];
}

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

export interface TopupRequest {
  id: string;
  userId: string;
  user?: User;
  amount: number;
  cryptoAccountId: string;
  cryptoAccount?: CryptoAccount;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  paymentProofUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TopupStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {
  currentSection = 'dashboard';
  isSidebarCollapsed = false;

  // Product management
  products: Product[] = [];
  isLoading = false;
  showAddProductForm = false;
  selectedFile: File | null = null;
  uploadProgress = 0;

  productForm = {
    name: '',
    description: '',
    price: 0,
    categoryId: 'bank-logs', // Default to first category
    stockQuantity: 0,
    productType: 'BANK_LOG', // Default product type
    images: [] as string[]
  };

  categories: any[] = [];
  isLoadingCategories = false;

  // Predefined categories - always available
  predefinedCategories = [
    // MAIN categories
    { id: 'bank-logs', name: 'Bank Logs', type: 'MAIN' },
    { id: 'bitcoin-log', name: 'Bitcoin Log', type: 'MAIN' },
    { id: 'carded', name: 'Carded', type: 'MAIN' },
    { id: 'carded-products', name: 'Carded Products', type: 'MAIN' },
    { id: 'cashapp-log', name: 'CashApp Log', type: 'MAIN' },
    { id: 'cc-cvv', name: 'CC CVV', type: 'MAIN' },
    { id: 'clips', name: 'Clips', type: 'MAIN' },
    { id: 'clone', name: 'Clone', type: 'MAIN' },
    { id: 'deposit-check', name: 'Deposit Check', type: 'MAIN' },
    { id: 'e-gift-cards', name: 'E-Gift Cards', type: 'MAIN' },
    { id: 'fraud-cards', name: 'Fraud Cards', type: 'MAIN' },
    { id: 'fullz', name: 'Fullz', type: 'MAIN' },
    { id: 'linkable', name: 'Linkable', type: 'MAIN' },
    { id: 'paypal-log', name: 'PayPal Log', type: 'MAIN' },
    { id: 'shake', name: 'Shake', type: 'MAIN' },
    { id: 'stealth-accounts', name: 'Stealth Accounts', type: 'MAIN' },
    { id: 'tools', name: 'Tools', type: 'MAIN' },
    { id: 'transfers', name: 'Transfers', type: 'MAIN' },
    
    // MORE_LOGS categories
    { id: 'usa-banks', name: 'USA Banks', type: 'MORE_LOGS' },
    { id: 'usa-cards', name: 'USA Cards', type: 'MORE_LOGS' },
    { id: 'uk-banks', name: 'UK Banks', type: 'MORE_LOGS' },
    { id: 'uk-cards', name: 'UK Cards', type: 'MORE_LOGS' },
    { id: 'europe-cards', name: 'Europe Cards', type: 'MORE_LOGS' },
    { id: 'canada-banks', name: 'Canada Banks', type: 'MORE_LOGS' },
    { id: 'canada-cards', name: 'Canada Cards', type: 'MORE_LOGS' },
    { id: 'africa-cards', name: 'Africa Cards', type: 'MORE_LOGS' },
    { id: 'australia-cards', name: 'Australia Cards', type: 'MORE_LOGS' },
    { id: 'credit-unions', name: 'Credit Unions', type: 'MORE_LOGS' },
    { id: 'crypto-logs', name: 'Crypto Logs', type: 'MORE_LOGS' },
    
    // LINKABLES categories
    { id: 'applepay', name: 'Apple Pay', type: 'LINKABLES' },
    { id: 'cashapp', name: 'CashApp', type: 'LINKABLES' },
    { id: 'googlepay', name: 'Google Pay', type: 'LINKABLES' },
    { id: 'paypal', name: 'PayPal', type: 'LINKABLES' },
    { id: 'venmo', name: 'Venmo', type: 'LINKABLES' },
    
    // TRANSFERS categories
    { id: 'bank-transfers', name: 'Bank Transfers', type: 'TRANSFERS' },
    { id: 'crypto-transfers', name: 'Crypto Transfers', type: 'TRANSFERS' },
    { id: 'wire-transfers', name: 'Wire Transfers', type: 'TRANSFERS' },
    { id: 'instant-transfers', name: 'Instant Transfers', type: 'TRANSFERS' }
  ];

  productTypeOptions = [
    { value: 'BANK_LOG', label: 'Bank Log' },
    { value: 'BITCOIN_LOG', label: 'Bitcoin Log' },
    { value: 'CARDED', label: 'Carded' },
    { value: 'CARDED_PRODUCT', label: 'Carded Product' },
    { value: 'CASHAPP_LOG', label: 'CashApp Log' },
    { value: 'CC_CVV', label: 'CC CVV' },
    { value: 'CLIP', label: 'Clip' },
    { value: 'CLONE', label: 'Clone' },
    { value: 'DEPOSIT_CHECK', label: 'Deposit Check' },
    { value: 'E_GIFT_CARD', label: 'E-Gift Card' },
    { value: 'FRAUD_CARD', label: 'Fraud Card' },
    { value: 'FULLZ', label: 'Fullz' },
    { value: 'LINKABLE', label: 'Linkable' },
    { value: 'PAYPAL_LOG', label: 'PayPal Log' },
    { value: 'SHAKE', label: 'Shake' },
    { value: 'STEALTH_ACCOUNT', label: 'Stealth Account' },
    { value: 'TOOL', label: 'Tool' },
    { value: 'TRANSFER', label: 'Transfer' },
    { value: 'USA_BANK', label: 'USA Bank' },
    { value: 'USA_CARD', label: 'USA Card' },
    { value: 'UK_BANK', label: 'UK Bank' },
    { value: 'UK_CARD', label: 'UK Card' },
    { value: 'EUROPE_CARD', label: 'Europe Card' },
    { value: 'CANADA_BANK', label: 'Canada Bank' },
    { value: 'CANADA_CARD', label: 'Canada Card' },
    { value: 'AFRICA_CARD', label: 'Africa Card' },
    { value: 'AUSTRALIA_CARD', label: 'Australia Card' },
    { value: 'CREDIT_UNION', label: 'Credit Union' },
    { value: 'CRYPTO_LOG', label: 'Crypto Log' }
  ];

  // User management
  users: User[] = [];
  isLoadingUsers = false;
  searchTerm = '';
  selectedStatus = '';

  roleOptions = [
    { value: 'USER', label: 'User' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'SUPER_ADMIN', label: 'Super Admin' }
  ];

  statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'Inactive' }
  ];

  // Order management
  orders: Order[] = [];
  isLoadingOrders = false;
  orderStats: OrderStats | null = null;
  
  // Payment proof modal
  showPaymentProofModal = false;
  selectedOrderForProof: Order | null = null;
  orderFilters: OrderFilterDto = {
    page: 1,
    limit: 10,
    status: '',
    paymentStatus: '',
    orderNumber: '',
    paymentMethod: ''
  };

  orderStatusOptions = [
    { value: '', label: 'All Status' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'PAID', label: 'Paid' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'REFUNDED', label: 'Refunded' }
  ];

  paymentStatusOptions = [
    { value: '', label: 'All Payment Status' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'PAID', label: 'Paid' },
    { value: 'FAILED', label: 'Failed' },
    { value: 'REFUNDED', label: 'Refunded' }
  ];

  // Video management
  videos: any[] = [];
  isLoadingVideos = false;
  showAddVideoForm = false;
  selectedVideoFile: File | null = null;
  selectedThumbnailFile: File | null = null;
  videoUploadProgress = 0;
  thumbnailUploadProgress = 0;

  videoForm = {
    title: '',
    description: '',
    category: '',
    platform: '',
    productId: '',
    isActive: true,
    videoUrl: '',
    thumbnailUrl: ''
  };

  videoCategories = [
    { value: 'cashout', label: 'Cashout Tutorial' },
    { value: 'carding', label: 'Carding Guide' },
    { value: 'bitcoin', label: 'Bitcoin Cashout' },
    { value: 'paypal', label: 'PayPal Cashout' },
    { value: 'cashapp', label: 'CashApp Cashout' },
    { value: 'bank', label: 'Bank Log Cashout' },
    { value: 'general', label: 'General Tutorial' }
  ];

  videoPlatforms = [
    { value: 'youtube', label: 'YouTube' },
    { value: 'vimeo', label: 'Vimeo' },
    { value: 'cloudinary', label: 'Cloudinary' },
    { value: 'local', label: 'Local Upload' }
  ];

  // Analytics
  analytics: any = null;
  isLoadingAnalytics = false;
  selectedTimeRange = '30'; // days
  selectedChartType = 'revenue';

  timeRangeOptions = [
    { value: '7', label: 'Last 7 Days' },
    { value: '30', label: 'Last 30 Days' },
    { value: '90', label: 'Last 90 Days' },
    { value: '365', label: 'Last Year' }
  ];

  chartTypeOptions = [
    { value: 'revenue', label: 'Revenue' },
    { value: 'orders', label: 'Orders' },
    { value: 'users', label: 'Users' },
    { value: 'products', label: 'Products' }
  ];

  // Blog management
  blogPosts: BlogPost[] = [];
  isLoadingBlogPosts = false;
  showAddBlogPostForm = false;
  showEditBlogPostForm = false;
  selectedBlogPost: BlogPost | null = null;
  blogCategories: BlogCategory[] = [];
  blogTags: BlogTag[] = [];
  isLoadingBlogCategories = false;
  isLoadingBlogTags = false;

  blogPostForm = {
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
    featuredImage: '',
    metaTitle: '',
    metaDescription: '',
    keywords: '', // Changed from array to string
    isFeatured: false,
    publishedAt: '',
    categoryId: '',
    tagIds: [] as string[]
  };

  blogStatusOptions = [
    { value: 'DRAFT', label: 'Draft' },
    { value: 'PUBLISHED', label: 'Published' },
    { value: 'ARCHIVED', label: 'Archived' },
  ];

  // Vouch management
  vouches: Vouch[] = [];
  isLoadingVouches = false;
  showAddVouchForm = false;
  showEditVouchForm = false;
  selectedVouch: Vouch | null = null;
  vouchStats: VouchStats | null = null;
  isLoadingVouchStats = false;
  currentVouchPage = 1;
  totalVouchPages = 1;
  totalVouches = 0;
  vouchItemsPerPage = 10;

  vouchForm = {
    username: '',
    avatarSeed: '',
    rating: 5,
    reviewText: '',
    reviewImage: '',
    isVerified: false
  };

  ratingOptions = [
    { value: 1, label: '1 Star' },
    { value: 2, label: '2 Stars' },
    { value: 3, label: '3 Stars' },
    { value: 4, label: '4 Stars' },
    { value: 5, label: '5 Stars' }
  ];

  vouchStatusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' }
  ];

  // Blog image upload
  blogImageFile: File | null = null;
  blogImageUploadProgress = 0;

  // Vouch image upload
  vouchImageFile: File | null = null;
  vouchImageUploadProgress = 0;

  // Crypto account management
  cryptoAccounts: CryptoAccount[] = [];
  isCryptoLoading = false;
  isCreatingCryptoAccount = false;
  isEditingCryptoAccount = false;
  editingCryptoAccountId: string | null = null;
  cryptoAccountForm: CreateCryptoAccountRequest = {
    name: '',
    symbol: '',
    address: '',
    network: '',
    isActive: true,
    order: 0,
    description: ''
  };

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private adminService: AdminService,
    private blogService: BlogService,
    private vouchService: VouchService,
    private toastService: ToastService,
    private cryptoService: CryptoService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.loadProducts();
    this.loadUsers();
    this.loadOrders();
    this.loadOrderStats();
    this.loadCategories(); // Load predefined categories
    this.loadVouches(); // Initialize vouches
    this.loadVouchStats(); // Initialize vouch stats
    this.loadCryptoAccounts(); // Initialize crypto accounts
    this.loadTopups(); // Initialize topup requests
  }

  navigateTo(section: string) {
    this.currentSection = section;

    // Update active menu item
    document.querySelectorAll('.sidebar-menu li a').forEach(link => {
      link.classList.remove('active');
    });

    const activeLink = document.querySelector(`[href="#${section}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }

    // Load data based on section
    if (section === 'dashboard') {
      this.loadProducts();
      this.loadUsers();
      this.loadOrders();
      this.loadOrderStats();
    } else if (section === 'products') {
      this.loadProducts();
      // Categories are predefined, no need to load them
    } else if (section === 'users') {
      this.loadUsers();
    } else if (section === 'orders') {
      this.loadOrders();
      this.loadOrderStats();
    } else if (section === 'videos') {
      this.loadVideos();
    } else if (section === 'analytics') {
      this.loadAnalytics();
    } else if (section === 'blog') {
      this.loadBlogPosts();
      this.loadBlogCategories();
      this.loadBlogTags();
    } else if (section === 'vouches') {
      this.loadVouches();
      this.loadVouchStats();
    } else if (section === 'topups') {
      this.loadTopups();
    }
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    this.authService.logout();
  }

  // Product Management Methods
  loadProducts() {
    this.isLoading = true;
          this.http.get('https://three60-web-gzzw.onrender.com/api/products', {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (response: any) => {
        this.products = response.products || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.toastService.error('Failed to load products');
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.productForm.images = []; // Clear previous images
    }
  }

  async uploadImage(): Promise<string> {
    if (!this.selectedFile) {
      console.log('No file selected for upload');
      return ''; // Return empty string if no file selected
    }

    console.log('Starting image upload for file:', this.selectedFile.name);

    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', this.selectedFile!);
      formData.append('type', 'image');

      console.log('FormData created:', formData);

      const authHeaders = this.authService.getAuthHeaders();
      // Remove Content-Type header for multipart uploads
      delete authHeaders['Content-Type'];

      this.http.post('https://three60-web-gzzw.onrender.com/api/upload/image', formData, {
        headers: authHeaders,
        reportProgress: true,
        observe: 'events'
      }).subscribe({
        next: (event: any) => {
          console.log('Upload event:', event.type, event);
          if (event.type === 1) {
            this.uploadProgress = Math.round((event.loaded / event.total) * 100);
          } else if (event.type === 4) {
            this.uploadProgress = 100;
            const response = event.body;
            console.log('Upload response:', response); // Debug log

            // Handle different response formats
            if (response) {
              let imageUrl = '';
              if (response.url) {
                imageUrl = response.url;
              } else if (response.secureUrl) {
                imageUrl = response.secureUrl;
              } else if (response.data && response.data.url) {
                imageUrl = response.data.url;
              } else if (typeof response === 'string') {
                imageUrl = response;
              }

              if (imageUrl) {
                console.log('Image URL extracted:', imageUrl);
                resolve(imageUrl);
              } else {
                console.error('No image URL found in response:', response);
                reject(new Error('Upload failed - no URL returned'));
              }
            } else {
              reject(new Error('Upload failed - no response body'));
            }
          }
        },
        error: (error) => {
          console.error('Upload error:', error);
          this.uploadProgress = 0;
          reject(error);
        }
      });
    });
  }

  async addProduct() {
    try {
      this.isLoading = true;

      console.log('Starting product creation...');
      console.log('Selected file:', this.selectedFile);
      console.log('Product form before upload:', this.productForm);

      // Upload image if file is selected
      if (this.selectedFile) {
        console.log('Uploading image...');
        const imageUrl = await this.uploadImage();
        console.log('Image upload result:', imageUrl);
        if (imageUrl) {
          this.productForm.images.push(imageUrl);
          console.log('Image URL added to form:', this.productForm.images);
        }
      }

      const productData = {
        name: this.productForm.name,
        description: this.productForm.description,
        price: this.productForm.price,
        categoryId: this.productForm.categoryId,
        stockQuantity: this.productForm.stockQuantity,
        productType: this.productForm.productType,
        images: this.productForm.images
      };

      console.log('Sending product data to backend:', productData);

      this.http.post('https://three60-web-gzzw.onrender.com/api/products', productData, {
        headers: this.authService.getAuthHeaders()
      }).subscribe({
        next: (response) => {
          console.log('Product creation response:', response);
          this.toastService.success('Product created successfully');
          this.resetProductForm();
          this.loadProducts();
          this.isLoading = false;
          this.uploadProgress = 0;
          this.selectedFile = null;
        },
        error: (error) => {
          console.error('Error creating product:', error);
          this.toastService.error('Failed to create product');
          this.isLoading = false;
          this.uploadProgress = 0;
        }
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      this.toastService.error('Failed to upload image');
      this.isLoading = false;
      this.uploadProgress = 0;
    }
  }

  resetProductForm() {
    this.productForm = {
      name: '',
      description: '',
      price: 0,
      categoryId: 'bank-logs', // Reset to default category
      stockQuantity: 0,
      productType: 'BANK_LOG', // Reset to default product type
      images: [] as string[]
    };
    this.showAddProductForm = false;
    this.selectedFile = null;
    this.uploadProgress = 0;
  }

  deleteProduct(productId: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.http.delete(`https://three60-web-gzzw.onrender.com/api/products/${productId}`, {
        headers: this.authService.getAuthHeaders()
      }).subscribe({
        next: (response) => {
          this.toastService.success('Product deleted successfully');
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.toastService.error('Failed to delete product');
        }
      });
    }
  }

  // User Management Methods
  loadUsers() {
    this.isLoadingUsers = true;
    const filters: any = {};

    if (this.searchTerm) {
      filters.search = this.searchTerm;
    }
    if (this.selectedStatus) {
      filters.isActive = this.selectedStatus;
    }

    this.adminService.getUsers(filters).subscribe({
      next: (response) => {
        this.users = response.users || [];
        this.isLoadingUsers = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.toastService.error('Failed to load users');
        this.isLoadingUsers = false;
      }
    });
  }

  updateUserRole(userId: string, role: string) {
    this.adminService.updateUserRole(userId, role).subscribe({
      next: (response) => {
        this.toastService.success('User role updated successfully');
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error updating user role:', error);
        this.toastService.error('Failed to update user role');
      }
    });
  }

  toggleUserStatus(userId: string, isActive: boolean) {
    this.adminService.toggleUserStatus(userId, isActive).subscribe({
      next: (response) => {
        this.toastService.success(`User ${isActive ? 'activated' : 'suspended'} successfully`);
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error updating user status:', error);
        this.toastService.error('Failed to update user status');
      }
    });
  }

  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      this.adminService.deleteUser(userId).subscribe({
        next: (response) => {
          this.toastService.success('User deleted successfully');
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          // Show more specific error message from backend
          const errorMessage = error?.error?.message || error?.message || 'Failed to delete user';
          this.toastService.error(errorMessage);
        }
      });
    }
  }

  onUserSearch() {
    this.loadUsers();
  }

  onStatusFilter() {
    this.loadUsers();
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-red-100 text-red-800';
      case 'ADMIN': return 'bg-yellow-100 text-yellow-800';
      case 'USER': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusBadgeClass(isActive: boolean): string {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }

  getFullName(user: User): string {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.username;
  }

  // Order Management Methods
  loadOrders() {
    this.isLoadingOrders = true;
    this.adminService.getOrders(this.orderFilters).subscribe({
      next: (response) => {
        this.orders = response.orders || [];
        this.isLoadingOrders = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.toastService.error('Failed to load orders');
        this.isLoadingOrders = false;
      }
    });
  }

  loadOrderStats() {
    this.adminService.getOrderStats().subscribe({
      next: (response) => {
        this.orderStats = response;
      },
      error: (error) => {
        console.error('Error loading order stats:', error);
      }
    });
  }

  updateOrderStatus(orderId: string, status: string) {
    this.adminService.updateOrderStatus(orderId, status).subscribe({
      next: (response) => {
        this.toastService.success('Order status updated successfully');
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        this.toastService.error('Failed to update order status');
      }
    });
  }

  updatePaymentStatus(orderId: string, paymentStatus: string) {
    this.adminService.updatePaymentStatus(orderId, paymentStatus).subscribe({
      next: (response) => {
        this.toastService.success('Payment status updated successfully');
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error updating payment status:', error);
        this.toastService.error('Failed to update payment status');
      }
    });
  }

  onOrderFilter() {
    this.orderFilters.page = 1; // Reset to first page when filtering
    this.loadOrders();
  }

  onOrderSearch() {
    this.orderFilters.page = 1; // Reset to first page when searching
    this.loadOrders();
  }

  clearOrderFilters() {
    this.orderFilters = {
      page: 1,
      limit: 10,
      status: '',
      paymentStatus: '',
      orderNumber: '',
      paymentMethod: ''
    };
    this.loadOrders();
  }

  getOrderStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PAID': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'REFUNDED': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getPaymentStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'REFUNDED': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getOrderItemsCount(order: Order): number {
    return order.items?.length || 0;
  }

  deleteOrder(orderId: string) {
    if (confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      this.adminService.deleteOrder(orderId).subscribe({
        next: (response) => {
          this.toastService.success('Order deleted successfully');
          this.loadOrders(); // Reload the orders list
        },
        error: (error) => {
          console.error('Error deleting order:', error);
          this.toastService.error('Failed to delete order');
        }
      });
    }
  }

  viewPaymentProof(order: Order) {
    this.selectedOrderForProof = order;
    this.showPaymentProofModal = true;
  }

  closePaymentProofModal() {
    this.showPaymentProofModal = false;
    this.selectedOrderForProof = null;
  }

  getPaymentProofUrl(paymentProof: string): string {
    console.log('getPaymentProofUrl called with:', paymentProof);
    
    // Extract filename from payment proof path
    if (paymentProof && paymentProof.includes('/uploads/')) {
      const filename = paymentProof.replace('/uploads/', '');
      const finalUrl = `https://three60-web-gzzw.onrender.com/api/orders/payment-proof/${filename}`;
      console.log('Constructed URL:', finalUrl);
      return finalUrl;
    }
    // If the payment proof is already a full URL, return it
    if (paymentProof && paymentProof.startsWith('http')) {
      console.log('Using existing URL:', paymentProof);
      return paymentProof;
    }
    // Fallback to direct URL construction
    const fallbackUrl = `https://three60-web-gzzw.onrender.com${paymentProof}`;
    console.log('Using fallback URL:', fallbackUrl);
    return fallbackUrl;
  }

  // Video Management Methods
  loadVideos() {
    this.isLoadingVideos = true;
          this.http.get('https://three60-web-gzzw.onrender.com/api/videos', {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (response: any) => {
        this.videos = response.videos || [];
        this.isLoadingVideos = false;
      },
      error: (error) => {
        console.error('Error loading videos:', error);
        this.toastService.error('Failed to load videos');
        this.isLoadingVideos = false;
      }
    });
  }

  onVideoFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedVideoFile = file;
    }
  }

  onThumbnailFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedThumbnailFile = file;
    }
  }

  async uploadVideo(): Promise<string> {
    if (!this.selectedVideoFile) {
      throw new Error('No video file selected');
    }

    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', this.selectedVideoFile!);

      const authHeaders = this.authService.getAuthHeaders();
      // Remove Content-Type header for multipart uploads
      delete authHeaders['Content-Type'];

      this.http.post('https://three60-web-gzzw.onrender.com/api/upload/video', formData, {
        headers: authHeaders,
        reportProgress: true,
        observe: 'events'
      }).subscribe({
        next: (event: any) => {
          if (event.type === 1) {
            this.videoUploadProgress = Math.round((event.loaded / event.total) * 100);
          } else if (event.type === 4) {
            this.videoUploadProgress = 100;
            const response = event.body;
            if (response && response.url) {
              resolve(response.url);
            } else {
              reject(new Error('Video upload failed - no URL returned'));
            }
          }
        },
        error: (error) => {
          console.error('Video upload error:', error);
          this.videoUploadProgress = 0;
          reject(error);
        }
      });
    });
  }

  async uploadThumbnail(): Promise<string> {
    if (!this.selectedThumbnailFile) {
      return '';
    }

    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', this.selectedThumbnailFile!);
      formData.append('type', 'image');

      const authHeaders = this.authService.getAuthHeaders();
      // Remove Content-Type header for multipart uploads
      delete authHeaders['Content-Type'];

      this.http.post('https://three60-web-gzzw.onrender.com/api/upload/image', formData, {
        headers: authHeaders,
        reportProgress: true,
        observe: 'events'
      }).subscribe({
        next: (event: any) => {
          if (event.type === 1) {
            this.thumbnailUploadProgress = Math.round((event.loaded / event.total) * 100);
          } else if (event.type === 4) {
            this.thumbnailUploadProgress = 100;
            const response = event.body;
            if (response && response.url) {
              resolve(response.url);
            } else {
              reject(new Error('Thumbnail upload failed - no URL returned'));
            }
          }
        },
        error: (error) => {
          console.error('Thumbnail upload error:', error);
          this.thumbnailUploadProgress = 0;
          reject(error);
        }
      });
    });
  }

  addVideo() {
    if (!this.videoForm.title || !this.videoForm.category) {
      this.toastService.error('Please fill in all required fields');
      return;
    }

    // Check if at least one video source is provided (file upload OR YouTube URL)
    if (!this.selectedVideoFile && !this.videoForm.videoUrl) {
      this.toastService.error('Please either upload a video file or provide a YouTube URL');
      return;
    }

    // If both file and URL are provided, prioritize file upload
    if (this.selectedVideoFile && this.videoForm.videoUrl) {
      this.toastService.warning('Both file and URL provided. File upload will be used.');
      this.videoForm.videoUrl = ''; // Clear URL when file is selected
    }

    this.isLoading = true;

    // Upload video file if selected
    if (this.selectedVideoFile) {
      this.uploadVideo().then((videoUrl: string) => {
        this.videoForm.videoUrl = videoUrl;
        this.uploadThumbnailIfSelected();
      }).catch((error: any) => {
        console.error('Error uploading video:', error);
        this.toastService.error('Failed to upload video file');
        this.isLoading = false;
      });
    } else {
      // YouTube URL provided, validate it
      if (this.isValidYouTubeUrl(this.videoForm.videoUrl)) {
        this.uploadThumbnailIfSelected();
      } else {
        this.toastService.error('Please provide a valid YouTube URL');
        this.isLoading = false;
      }
    }
  }

  // Helper method to validate YouTube URLs
  isValidYouTubeUrl(url: string): boolean {
    if (!url) return false;
    
    try {
      // Check if it's a valid URL
      new URL(url);
      
      // Check if it contains YouTube
      const containsYoutube = url.includes('youtube.com') || url.includes('youtu.be');
      
      return containsYoutube;
    } catch (error) {
      return false;
    }
  }

  private uploadThumbnailIfSelected() {
    if (this.selectedThumbnailFile) {
      this.uploadThumbnail().then((thumbnailUrl: string) => {
        this.videoForm.thumbnailUrl = thumbnailUrl;
        this.createVideoRecord();
      }).catch((error: any) => {
        console.error('Error uploading thumbnail:', error);
        this.toastService.error('Failed to upload thumbnail file');
        this.isLoading = false;
      });
    } else {
      // No thumbnail selected, create video record with just video URL
      this.createVideoRecord();
    }
  }

  private createVideoRecord() {
    const videoData: any = {
      title: this.videoForm.title,
      description: this.videoForm.description,
      category: this.videoForm.category,
      platform: this.videoForm.platform,
      isActive: Boolean(this.videoForm.isActive),
      videoUrl: this.videoForm.videoUrl
    };

    // Only include thumbnailUrl if it's not empty
    if (this.videoForm.thumbnailUrl && this.videoForm.thumbnailUrl.trim() !== '') {
      videoData.thumbnailUrl = this.videoForm.thumbnailUrl;
    }

          this.http.post('https://three60-web-gzzw.onrender.com/api/videos', videoData, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (response) => {
        this.toastService.success('Video added successfully');
        this.resetVideoForm();
        this.loadVideos();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error creating video:', error);
        this.toastService.error('Failed to create video');
        this.isLoading = false;
      }
    });
  }

  resetVideoForm() {
    this.videoForm = {
      title: '',
      description: '',
      category: '',
      platform: '',
      productId: '',
      isActive: true,
      videoUrl: '',
      thumbnailUrl: ''
    };
    this.selectedVideoFile = null;
    this.selectedThumbnailFile = null;
    this.videoUploadProgress = 0;
    this.thumbnailUploadProgress = 0;
    this.showAddVideoForm = false;
  }

  deleteVideo(videoId: string) {
    if (confirm('Are you sure you want to delete this video?')) {
      this.http.delete(`https://three60-web-gzzw.onrender.com/api/videos/${videoId}`, {
        headers: this.authService.getAuthHeaders()
      }).subscribe({
        next: (response) => {
          this.toastService.success('Video deleted successfully');
          this.loadVideos();
        },
        error: (error) => {
          console.error('Error deleting video:', error);
          this.toastService.error('Failed to delete video');
        }
      });
    }
  }

  toggleVideoStatus(videoId: string, isActive: boolean) {
    this.http.patch(`https://three60-web-gzzw.onrender.com/api/videos/${videoId}/status`,
      { isActive },
      { headers: this.authService.getAuthHeaders() }
    ).subscribe({
      next: (response) => {
        this.toastService.success(`Video ${isActive ? 'activated' : 'deactivated'} successfully`);
        this.loadVideos();
      },
      error: (error) => {
        console.error('Error updating video status:', error);
        this.toastService.error('Failed to update video status');
      }
    });
  }

  // Analytics Methods
  loadAnalytics() {
    this.isLoadingAnalytics = true;
    const params = { timeRange: this.selectedTimeRange };

          this.http.get('https://three60-web-gzzw.onrender.com/api/analytics/dashboard', {
      headers: this.authService.getAuthHeaders(),
      params
    }).subscribe({
      next: (response: any) => {
        this.analytics = response;
        this.isLoadingAnalytics = false;
      },
      error: (error) => {
        console.error('Error loading analytics:', error);
        this.toastService.error('Failed to load analytics');
        this.isLoadingAnalytics = false;
      }
    });
  }

  onTimeRangeChange() {
    this.loadAnalytics();
  }

  onChartTypeChange() {
    // This would trigger chart updates
  }

  getRevenueGrowth(): number {
    if (!this.analytics?.revenue) return 0;
    const current = this.analytics.revenue.current || 0;
    const previous = this.analytics.revenue.previous || 0;
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  getOrderGrowth(): number {
    if (!this.analytics?.orders) return 0;
    const current = this.analytics.orders.current || 0;
    const previous = this.analytics.orders.previous || 0;
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  getUserGrowth(): number {
    if (!this.analytics?.users) return 0;
    const current = this.analytics.users.current || 0;
    const previous = this.analytics.users.previous || 0;
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  getAverageOrderValue(): number {
    if (!this.analytics?.revenue || !this.analytics?.orders) return 0;
    const revenue = this.analytics.revenue.current || 0;
    const orders = this.analytics.orders.current || 0;
    return orders > 0 ? revenue / orders : 0;
  }

  getConversionRate(): number {
    if (!this.analytics?.users || !this.analytics?.orders) return 0;
    const users = this.analytics.users.current || 0;
    const orders = this.analytics.orders.current || 0;
    return users > 0 ? (orders / users) * 100 : 0;
  }

  getTopProducts(): any[] {
    return this.analytics?.topProducts || [];
  }

  getTopCategories(): any[] {
    return this.analytics?.topCategories || [];
  }

  getRecentActivity(): any[] {
    return this.analytics?.recentActivity || [];
  }

  getSalesByDay(): any[] {
    return this.analytics?.salesByDay || [];
  }

  getOrderStatusBreakdown(): any[] {
    return this.analytics?.orderStatusBreakdown || [];
  }

  getPaymentMethodBreakdown(): any[] {
    return this.analytics?.paymentMethodBreakdown || [];
  }

  getGeographicData(): any[] {
    return this.analytics?.geographicData || [];
  }

  getDeviceUsage(): any[] {
    return this.analytics?.deviceUsage || [];
  }

  getTrafficSources(): any[] {
    return this.analytics?.trafficSources || [];
  }

  getCustomerSegments(): any[] {
    return this.analytics?.customerSegments || [];
  }

  getInventoryAlerts(): any[] {
    return this.analytics?.inventoryAlerts || [];
  }

  getRevenueByCategory(): any[] {
    return this.analytics?.revenueByCategory || [];
  }

  getMonthlyTrends(): any[] {
    return this.analytics?.monthlyTrends || [];
  }

  getYearlyComparison(): any[] {
    return this.analytics?.yearlyComparison || [];
  }

  getProfitMargin(): number {
    if (!this.analytics?.revenue || !this.analytics?.costs) return 0;
    const revenue = this.analytics.revenue.current || 0;
    const costs = this.analytics.costs || 0;
    return revenue > 0 ? ((revenue - costs) / revenue) * 100 : 0;
  }

  getCustomerRetentionRate(): number {
    return this.analytics?.customerRetentionRate || 0;
  }

  getCustomerLifetimeValue(): number {
    return this.analytics?.customerLifetimeValue || 0;
  }

  getChurnRate(): number {
    return this.analytics?.churnRate || 0;
  }

  getRefundRate(): number {
    if (!this.analytics?.orders || !this.analytics?.refunds) return 0;
    const orders = this.analytics.orders.current || 0;
    const refunds = this.analytics.refunds || 0;
    return orders > 0 ? (refunds / orders) * 100 : 0;
  }

  getAverageResponseTime(): number {
    return this.analytics?.averageResponseTime || 0;
  }

  getCustomerSatisfactionScore(): number {
    return this.analytics?.customerSatisfactionScore || 0;
  }

  getSocialMediaMetrics(): any {
    return this.analytics?.socialMediaMetrics || {};
  }

  getEmailMarketingMetrics(): any {
    return this.analytics?.emailMarketingMetrics || {};
  }

  getSEOmetrics(): any {
    return this.analytics?.seoMetrics || {};
  }

  getSecurityMetrics(): any {
    return this.analytics?.securityMetrics || {};
  }

  getSystemHealth(): any {
    return this.analytics?.systemHealth || {};
  }

  exportAnalytics() {
          this.http.get('https://three60-web-gzzw.onrender.com/api/analytics/export', {
      headers: this.authService.getAuthHeaders(),
      responseType: 'blob'
    }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.toastService.success('Analytics exported successfully');
      },
      error: (error) => {
        console.error('Error exporting analytics:', error);
        this.toastService.error('Failed to export analytics');
      }
    });
  }

  loadCategories() {
    // Use predefined categories instead of loading from database
    this.categories = this.predefinedCategories;
    this.isLoadingCategories = false;
  }

  seedCategories() {
    this.isLoadingCategories = true;
          this.http.post('https://three60-web-gzzw.onrender.com/api/categories/seed/all', {}, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (response: any) => {
        this.toastService.success(`Categories seeded successfully! Created: ${response.created}, Updated: ${response.updated}`);
        this.loadCategories(); // Reload categories after seeding
      },
      error: (error) => {
        console.error('Error seeding categories:', error);
        this.toastService.error('Failed to seed categories');
        this.isLoadingCategories = false;
      }
    });
  }

  // Blog Management Methods
  loadBlogPosts() {
    this.isLoadingBlogPosts = true;
    this.blogService.getBlogPosts().subscribe({
      next: (response) => {
        this.blogPosts = response.posts;
        this.isLoadingBlogPosts = false;
      },
      error: (error) => {
        console.error('Error loading blog posts:', error);
        this.toastService.error('Failed to load blog posts');
        this.isLoadingBlogPosts = false;
      }
    });
  }

  loadBlogCategories() {
    this.isLoadingBlogCategories = true;
    this.blogService.getBlogCategories().subscribe({
      next: (categories) => {
        this.blogCategories = categories;
        this.isLoadingBlogCategories = false;
      },
      error: (error) => {
        console.error('Error loading blog categories:', error);
        this.toastService.error('Failed to load blog categories');
        this.isLoadingBlogCategories = false;
      }
    });
  }

  loadBlogTags() {
    this.isLoadingBlogTags = true;
    this.blogService.getBlogTags().subscribe({
      next: (tags) => {
        this.blogTags = tags;
        this.isLoadingBlogTags = false;
      },
      error: (error) => {
        console.error('Error loading blog tags:', error);
        this.toastService.error('Failed to load blog tags');
        this.isLoadingBlogTags = false;
      }
    });
  }

  showAddBlogPost() {
    this.showAddBlogPostForm = true;
    this.showEditBlogPostForm = false;
    this.selectedBlogPost = null;
    this.resetBlogPostForm();
    this.loadBlogCategories();
    this.loadBlogTags();
  }

  showEditBlogPost(post: BlogPost) {
    this.showEditBlogPostForm = true;
    this.showAddBlogPostForm = false;
    this.selectedBlogPost = post;
    this.loadBlogCategories();
    this.loadBlogTags();

    // Populate form with post data
    this.blogPostForm = {
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      status: post.status,
      featuredImage: post.featuredImage || '',
      metaTitle: post.metaTitle || '',
      metaDescription: post.metaDescription || '',
      keywords: post.keywords || '',
      isFeatured: post.isFeatured,
      publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().split('T')[0] : '',
      categoryId: post.categoryId || '',
      tagIds: post.tags?.map(tag => tag.id) || []
    };
  }

  async addBlogPost() {
    if (!this.blogPostForm.title || !this.blogPostForm.slug || !this.blogPostForm.content) {
      this.toastService.error('Please fill in all required fields');
      return;
    }

    if (this.blogImageFile) {
      await this.uploadBlogImage();
    }

    const createDto: CreateBlogPostDto = {
      title: this.blogPostForm.title,
      slug: this.blogPostForm.slug,
      content: this.blogPostForm.content,
      excerpt: this.blogPostForm.excerpt,
      status: this.blogPostForm.status,
      featuredImage: this.blogPostForm.featuredImage || undefined,
      metaTitle: this.blogPostForm.metaTitle || undefined,
      metaDescription: this.blogPostForm.metaDescription || undefined,
      keywords: this.blogPostForm.keywords,
      isFeatured: this.blogPostForm.isFeatured,
      publishedAt: this.blogPostForm.publishedAt || undefined,
      categoryId: this.blogPostForm.categoryId || undefined,
      tagIds: this.blogPostForm.tagIds
    };

    this.blogService.createBlogPost(createDto).subscribe({
      next: (post) => {
        this.toastService.success('Blog post created successfully');
        this.showAddBlogPostForm = false;
        this.resetBlogPostForm();
        this.loadBlogPosts();
      },
      error: (error) => {
        console.error('Error creating blog post:', error);
        this.toastService.error('Failed to create blog post');
      }
    });
  }

  async updateBlogPost() {
    if (!this.selectedBlogPost) {
      this.toastService.error('No blog post selected for editing');
      return;
    }

    if (!this.blogPostForm.title || !this.blogPostForm.slug || !this.blogPostForm.content) {
      this.toastService.error('Please fill in all required fields');
      return;
    }

    const updateDto: UpdateBlogPostDto = {
      title: this.blogPostForm.title,
      slug: this.blogPostForm.slug,
      content: this.blogPostForm.content,
      excerpt: this.blogPostForm.excerpt,
      status: this.blogPostForm.status,
      featuredImage: this.blogPostForm.featuredImage || undefined,
      metaTitle: this.blogPostForm.metaTitle || undefined,
      metaDescription: this.blogPostForm.metaDescription || undefined,
      keywords: this.blogPostForm.keywords,
      isFeatured: this.blogPostForm.isFeatured,
      publishedAt: this.blogPostForm.publishedAt || undefined,
      categoryId: this.blogPostForm.categoryId || undefined
    };

    this.blogService.updateBlogPost(this.selectedBlogPost.id, updateDto).subscribe({
      next: (post) => {
        this.toastService.success('Blog post updated successfully');
        this.showEditBlogPostForm = false;
        this.selectedBlogPost = null;
        this.resetBlogPostForm();
        this.loadBlogPosts();
      },
      error: (error) => {
        console.error('Error updating blog post:', error);
        this.toastService.error('Failed to update blog post');
      }
    });
  }

  deleteBlogPost(postId: string) {
    if (confirm('Are you sure you want to delete this blog post?')) {
      this.blogService.deleteBlogPost(postId).subscribe({
        next: (response) => {
          this.toastService.success('Blog post deleted successfully');
          this.loadBlogPosts();
        },
        error: (error) => {
          console.error('Error deleting blog post:', error);
          this.toastService.error('Failed to delete blog post');
        }
      });
    }
  }

  toggleBlogPostStatus(post: BlogPost) {
    const newStatus = post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    const updateDto: UpdateBlogPostDto = {
      status: newStatus,
      publishedAt: newStatus === 'PUBLISHED' ? new Date().toISOString() : undefined
    };

    this.blogService.updateBlogPost(post.id, updateDto).subscribe({
      next: (updatedPost) => {
        this.toastService.success(`Blog post ${newStatus.toLowerCase()} successfully`);
        this.loadBlogPosts();
      },
      error: (error) => {
        console.error('Error updating blog post status:', error);
        this.toastService.error('Failed to update blog post status');
      }
    });
  }

  resetBlogPostForm() {
    this.blogPostForm = {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      status: 'DRAFT',
      featuredImage: '',
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      isFeatured: false,
      publishedAt: '',
      categoryId: '',
      tagIds: []
    };
  }

  generateSlug() {
    if (this.blogPostForm.title) {
      const baseSlug = this.blogPostForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Add timestamp to make slug unique
      const timestamp = Date.now();
      this.blogPostForm.slug = `${baseSlug}-${timestamp}`;
    }
  }

  getBlogStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatBlogDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  // Vouch Management Methods
  loadVouches(page: number = 1) {
    this.isLoadingVouches = true;
    this.currentVouchPage = page;

    this.vouchService.getVouches({
      page,
      limit: this.vouchItemsPerPage
    }).subscribe({
      next: (response: VouchResponse) => {
        this.vouches = response.vouches;
        this.totalVouchPages = response.totalPages;
        this.totalVouches = response.total;
        this.isLoadingVouches = false;
      },
      error: (error) => {
        console.error('Error loading vouches:', error);
        this.toastService.error('Failed to load vouches');
        this.isLoadingVouches = false;
      }
    });
  }

  loadVouchStats() {
    this.isLoadingVouchStats = true;
    this.vouchService.getVouchStats().subscribe({
      next: (stats: VouchStats) => {
        this.vouchStats = stats;
        this.isLoadingVouchStats = false;
      },
      error: (error) => {
        console.error('Error loading vouch stats:', error);
        this.toastService.error('Failed to load vouch statistics');
        this.isLoadingVouchStats = false;
      }
    });
  }

  showAddVouch() {
    this.showAddVouchForm = true;
    this.showEditVouchForm = false;
    this.selectedVouch = null;
    this.resetVouchForm();
  }

  showEditVouch(vouch: Vouch) {
    this.showEditVouchForm = true;
    this.showAddVouchForm = false;
    this.selectedVouch = vouch;
    this.vouchForm = {
      username: vouch.username,
      avatarSeed: vouch.avatarSeed,
      rating: vouch.rating,
      reviewText: vouch.reviewText,
      reviewImage: vouch.reviewImage || '',
      isVerified: vouch.isVerified
    };
  }

  async addVouch() {
    if (!this.vouchForm.username || !this.vouchForm.reviewText) {
      this.toastService.error('Please fill in all required fields');
      return;
    }

    if (this.vouchImageFile) {
      await this.uploadVouchImage();
    }

    const createVouchDto: CreateVouchDto = {
      username: this.vouchForm.username,
      avatarSeed: this.vouchForm.avatarSeed || this.vouchForm.username,
      rating: this.vouchForm.rating,
      reviewText: this.vouchForm.reviewText,
      reviewImage: this.vouchForm.reviewImage || undefined,
      isVerified: this.vouchForm.isVerified
    };

    this.vouchService.createVouch(createVouchDto).subscribe({
      next: (vouch: Vouch) => {
        this.toastService.success('Vouch created successfully!');
        this.showAddVouchForm = false;
        this.resetVouchForm();
        this.loadVouches(this.currentVouchPage);
        this.loadVouchStats();
      },
      error: (error) => {
        console.error('Error creating vouch:', error);
        this.toastService.error('Failed to create vouch');
      }
    });
  }

  async updateVouch() {
    if (!this.selectedVouch || !this.vouchForm.username || !this.vouchForm.reviewText) {
      this.toastService.error('Please fill in all required fields');
      return;
    }

    const updateVouchDto: UpdateVouchDto = {
      username: this.vouchForm.username,
      avatarSeed: this.vouchForm.avatarSeed || this.vouchForm.username,
      rating: this.vouchForm.rating,
      reviewText: this.vouchForm.reviewText,
      reviewImage: this.vouchForm.reviewImage || undefined,
      isVerified: this.vouchForm.isVerified
    };

    this.vouchService.updateVouch(this.selectedVouch.id, updateVouchDto).subscribe({
      next: (vouch: Vouch) => {
        this.toastService.success('Vouch updated successfully!');
        this.showEditVouchForm = false;
        this.selectedVouch = null;
        this.resetVouchForm();
        this.loadVouches(this.currentVouchPage);
        this.loadVouchStats();
      },
      error: (error) => {
        console.error('Error updating vouch:', error);
        this.toastService.error('Failed to update vouch');
      }
    });
  }

  deleteVouch(vouchId: string) {
    if (confirm('Are you sure you want to delete this vouch?')) {
      this.vouchService.deleteVouch(vouchId).subscribe({
        next: () => {
          this.toastService.success('Vouch deleted successfully!');
          this.loadVouches(this.currentVouchPage);
          this.loadVouchStats();
        },
        error: (error) => {
          console.error('Error deleting vouch:', error);
          this.toastService.error('Failed to delete vouch');
        }
      });
    }
  }

  approveVouch(vouchId: string) {
    this.vouchService.approveVouch(vouchId).subscribe({
      next: (vouch: Vouch) => {
        this.toastService.success('Vouch approved successfully!');
        this.loadVouches(this.currentVouchPage);
        this.loadVouchStats();
      },
      error: (error) => {
        console.error('Error approving vouch:', error);
        this.toastService.error('Failed to approve vouch');
      }
    });
  }

  rejectVouch(vouchId: string) {
    this.vouchService.rejectVouch(vouchId).subscribe({
      next: (vouch: Vouch) => {
        this.toastService.success('Vouch rejected successfully!');
        this.loadVouches(this.currentVouchPage);
        this.loadVouchStats();
      },
      error: (error) => {
        console.error('Error rejecting vouch:', error);
        this.toastService.error('Failed to reject vouch');
      }
    });
  }

  toggleVouchVerification(vouchId: string) {
    this.vouchService.toggleVerification(vouchId).subscribe({
      next: (vouch: Vouch) => {
        this.toastService.success('Verification status updated successfully!');
        this.loadVouches(this.currentVouchPage);
        this.loadVouchStats();
      },
      error: (error) => {
        console.error('Error toggling verification:', error);
        this.toastService.error('Failed to update verification status');
      }
    });
  }

  resetVouchForm() {
    this.vouchForm = {
      username: '',
      avatarSeed: '',
      rating: 5,
      reviewText: '',
      reviewImage: '',
      isVerified: false
    };
  }

  onVouchPageChange(page: number) {
    if (page >= 1 && page <= this.totalVouchPages) {
      this.loadVouches(page);
    }
  }

  getVouchStatusBadgeClass(status: string): string {
    switch (status) {
      case 'APPROVED':
        return 'badge bg-success';
      case 'PENDING':
        return 'badge bg-warning';
      case 'REJECTED':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  getVouchVerifiedBadgeClass(isVerified: boolean): string {
    return isVerified ? 'badge bg-primary' : 'badge bg-secondary';
  }

  formatVouchDate(dateString: string): string {
    return this.vouchService.formatDate(dateString);
  }

  getVouchAvatarUrl(avatarSeed: string): string {
    return this.vouchService.getAvatarUrl(avatarSeed);
  }

  getVouchRatingStars(rating: number): { filled: number[]; empty: number[] } {
    const stars = this.vouchService.getRatingStars(rating);
    return {
      filled: Array(stars.filled).fill(0),
      empty: Array(stars.empty).fill(0)
    };
  }

  // Generate page numbers for vouch pagination
  getVouchPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (this.totalVouchPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalVouchPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, this.currentVouchPage - Math.floor(maxVisiblePages / 2));
      const end = Math.min(this.totalVouchPages, start + maxVisiblePages - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  onBlogImageFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.blogImageFile = file;
      this.uploadBlogImage();
    }
  }

  async uploadBlogImage(): Promise<string> {
    if (!this.blogImageFile) return '';
    const formData = new FormData();
    formData.append('file', this.blogImageFile);
    formData.append('type', 'image'); // Add required type field
    this.blogImageUploadProgress = 0;
    try {
      const authHeaders = this.authService.getAuthHeaders();
      // Remove Content-Type header for multipart uploads
      delete authHeaders['Content-Type'];

      const req = this.http.post('https://three60-web-gzzw.onrender.com/api/upload/image', formData, {
        reportProgress: true,
        observe: 'events',
        headers: authHeaders
      });
      return await new Promise((resolve, reject) => {
        req.subscribe({
          next: (event: any) => {
            if (event.type === 1 && event.total) {
              this.blogImageUploadProgress = Math.round((event.loaded / event.total) * 100);
            } else if (event.body && event.body.url) {
              this.blogPostForm.featuredImage = event.body.url;
              this.blogImageUploadProgress = 100;
              resolve(event.body.url);
            }
          },
          error: (err) => {
            this.toastService.error('Failed to upload blog image');
            this.blogImageUploadProgress = 0;
            reject(err);
          }
        });
      });
    } catch (err) {
      this.toastService.error('Failed to upload blog image');
      this.blogImageUploadProgress = 0;
      return '';
    }
  }

  onVouchImageFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.vouchImageFile = file;
      this.uploadVouchImage();
    }
  }

  async uploadVouchImage(): Promise<string> {
    if (!this.vouchImageFile) return '';
    const formData = new FormData();
    formData.append('file', this.vouchImageFile);
    formData.append('type', 'image'); // Add required type field
    this.vouchImageUploadProgress = 0;
    try {
      const authHeaders = this.authService.getAuthHeaders();
      // Remove Content-Type header for multipart uploads
      delete authHeaders['Content-Type'];

      const req = this.http.post('https://three60-web-gzzw.onrender.com/api/upload/image', formData, {
        reportProgress: true,
        observe: 'events',
        headers: authHeaders
      });
      return await new Promise((resolve, reject) => {
        req.subscribe({
          next: (event: any) => {
            if (event.type === 1 && event.total) {
              this.vouchImageUploadProgress = Math.round((event.loaded / event.total) * 100);
            } else if (event.body && event.body.url) {
              this.vouchForm.reviewImage = event.body.url;
              this.vouchImageUploadProgress = 100;
              resolve(event.body.url);
            }
          },
          error: (err) => {
            this.toastService.error('Failed to upload vouch image');
            this.vouchImageUploadProgress = 0;
            reject(err);
          }
        });
      });
    } catch (err) {
      this.toastService.error('Failed to upload vouch image');
      this.vouchImageUploadProgress = 0;
      return '';
    }
  }

  // Crypto Account Management Methods
  loadCryptoAccounts() {
    this.isCryptoLoading = true;
    this.cryptoService.getAllAccounts().subscribe({
      next: (accounts) => {
        this.cryptoAccounts = accounts;
        this.isCryptoLoading = false;
        console.log('Loaded crypto accounts:', accounts);
      },
      error: (error) => {
        console.error('Error loading crypto accounts:', error);
        this.toastService.error('Failed to load crypto accounts');
        this.isCryptoLoading = false;
      }
    });
  }

  startCreatingCryptoAccount() {
    this.isCreatingCryptoAccount = true;
    this.isEditingCryptoAccount = false;
    this.editingCryptoAccountId = null;
    this.resetCryptoForm();
  }

  startEditingCryptoAccount(account: CryptoAccount) {
    this.isEditingCryptoAccount = true;
    this.isCreatingCryptoAccount = false;
    this.editingCryptoAccountId = account.id;
    this.cryptoAccountForm = {
      name: account.name,
      symbol: account.symbol,
      address: account.address,
      network: account.network || '',
      isActive: account.isActive,
      order: account.order,
      description: account.description || ''
    };
  }

  saveCryptoAccount() {
    if (this.isCreatingCryptoAccount) {
      this.createCryptoAccount();
    } else if (this.isEditingCryptoAccount && this.editingCryptoAccountId) {
      this.updateCryptoAccount();
    }
  }

  createCryptoAccount() {
    if (!this.validateCryptoForm()) return;

    this.isCryptoLoading = true;
    this.cryptoService.createAccount(this.cryptoAccountForm).subscribe({
      next: (account) => {
        this.toastService.success('Crypto account created successfully!');
        this.cancelCryptoEdit();
        this.loadCryptoAccounts();
        console.log('Created crypto account:', account);
      },
      error: (error) => {
        console.error('Error creating crypto account:', error);
        this.toastService.error('Failed to create crypto account');
        this.isCryptoLoading = false;
      }
    });
  }

  updateCryptoAccount() {
    if (!this.validateCryptoForm() || !this.editingCryptoAccountId) return;

    this.isCryptoLoading = true;
    this.cryptoService.updateAccount(this.editingCryptoAccountId, this.cryptoAccountForm).subscribe({
      next: (account) => {
        this.toastService.success('Crypto account updated successfully!');
        this.cancelCryptoEdit();
        this.loadCryptoAccounts();
        console.log('Updated crypto account:', account);
      },
      error: (error) => {
        console.error('Error updating crypto account:', error);
        this.toastService.error('Failed to update crypto account');
        this.isCryptoLoading = false;
      }
    });
  }

  deleteCryptoAccount(accountId: string, accountName: string) {
    if (!confirm(`Are you sure you want to delete the ${accountName} account? This action cannot be undone.`)) {
      return;
    }

    this.isCryptoLoading = true;
    this.cryptoService.deleteAccount(accountId).subscribe({
      next: () => {
        this.toastService.success('Crypto account deleted successfully!');
        this.loadCryptoAccounts();
      },
      error: (error) => {
        console.error('Error deleting crypto account:', error);
        this.toastService.error('Failed to delete crypto account');
        this.isCryptoLoading = false;
      }
    });
  }

  cancelCryptoEdit() {
    this.isCreatingCryptoAccount = false;
    this.isEditingCryptoAccount = false;
    this.editingCryptoAccountId = null;
    this.resetCryptoForm();
    this.isCryptoLoading = false;
  }

  resetCryptoForm() {
    this.cryptoAccountForm = {
      name: '',
      symbol: '',
      address: '',
      network: '',
      isActive: true,
      order: 0,
      description: ''
    };
  }

  validateCryptoForm(): boolean {
    if (!this.cryptoAccountForm.name.trim()) {
      this.toastService.error('Please enter a name');
      return false;
    }
    if (!this.cryptoAccountForm.symbol.trim()) {
      this.toastService.error('Please enter a symbol');
      return false;
    }
    if (!this.cryptoAccountForm.address.trim()) {
      this.toastService.error('Please enter an address');
      return false;
    }
    return true;
  }

  seedDefaultCryptoAccounts() {
    if (!confirm('This will create default crypto accounts if they don\'t exist. Continue?')) {
      return;
    }

    this.isCryptoLoading = true;
    this.cryptoService.seedDefaultAccounts().subscribe({
      next: (response) => {
        this.toastService.success(response.message);
        this.loadCryptoAccounts();
      },
      error: (error) => {
        console.error('Error seeding accounts:', error);
        this.toastService.error('Failed to seed default accounts');
        this.isCryptoLoading = false;
      }
    });
  }

  copyCryptoAddress(address: string) {
    navigator.clipboard.writeText(address).then(() => {
      this.toastService.success('Address copied to clipboard!');
    }).catch(() => {
      this.toastService.error('Failed to copy address');
    });
  }

  // Topup Management
  topups: TopupRequest[] = [];
  isLoadingTopups = false;
  topupStats: TopupStats | null = null;
  pendingTopupsCount = 0;
  isProcessingTopup = false;
  showTopupProofModal = false;
  selectedTopupForProof: TopupRequest | null = null;

  loadTopups() {
    this.isLoadingTopups = true;
    // For now, we'll simulate loading topups
    // In a real implementation, this would call an API
    setTimeout(() => {
      this.topups = [
        {
          id: 'TOPUP-001',
          userId: '1',
          user: {
            id: '1',
            username: 'john_doe',
            email: 'john@example.com',
            role: 'USER',
            isActive: true,
            balance: 500.00,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          amount: 100.00,
          cryptoAccountId: '1',
          cryptoAccount: {
            id: '1',
            name: 'Bitcoin',
            symbol: 'BTC',
            address: '1AGbgzEPd14hzLoDyYoDzwEH1MP5ZekmBi',
            isActive: true,
            order: 1,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          status: 'PENDING',
          paymentProofUrl: 'https://example.com/proof1.jpg',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 'TOPUP-002',
          userId: '2',
          user: {
            id: '2',
            username: 'jane_smith',
            email: 'jane@example.com',
            role: 'USER',
            isActive: true,
            balance: 750.00,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          },
          amount: 250.00,
          cryptoAccountId: '2',
          cryptoAccount: {
            id: '2',
            name: 'Ethereum',
            symbol: 'ETH',
            address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
            isActive: true,
            order: 2,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          status: 'APPROVED',
          paymentProofUrl: 'https://example.com/proof2.jpg',
          createdAt: '2024-01-14T15:45:00Z',
          updatedAt: '2024-01-14T16:00:00Z'
        }
      ];
      
      this.topupStats = {
        totalRequests: this.topups.length,
        pendingRequests: this.topups.filter(t => t.status === 'PENDING').length,
        approvedRequests: this.topups.filter(t => t.status === 'APPROVED').length,
        rejectedRequests: this.topups.filter(t => t.status === 'REJECTED').length
      };
      
      this.pendingTopupsCount = this.topupStats.pendingRequests;
      this.isLoadingTopups = false;
    }, 1000);
  }

  approveTopup(topupId: string) {
    this.isProcessingTopup = true;
    
    const topup = this.topups.find(t => t.id === topupId);
    if (!topup) {
      this.toastService.error('Topup request not found');
      this.isProcessingTopup = false;
      return;
    }

    // Use the new balance management system
    this.adminService.updateUserBalance(
      topup.userId, 
      topup.amount, 
      'TOPUP_APPROVAL', 
      `Topup approved - Request #${topupId}`,
      topupId,
      'topup'
    ).subscribe({
      next: (userProfile) => {
        // Update topup status
        topup.status = 'APPROVED';
        topup.updatedAt = new Date().toISOString();
        
        // Update stats
        this.topupStats!.pendingRequests--;
        this.topupStats!.approvedRequests++;
        this.pendingTopupsCount = this.topupStats!.pendingRequests;
        
        this.toastService.success(`Topup request #${topupId} approved! $${topup.amount.toFixed(2)} added to user account. New balance: $${userProfile.balance.toFixed(2)}`);
        this.isProcessingTopup = false;
        this.closeTopupProofModal();
      },
      error: (error) => {
        console.error('Failed to add funds to user account:', error);
        this.toastService.error('Failed to add funds to user account. Please try again.');
        this.isProcessingTopup = false;
      }
    });
  }

  rejectTopup(topupId: string) {
    this.isProcessingTopup = true;
    
    // Simulate API call to reject topup
    setTimeout(() => {
      const topup = this.topups.find(t => t.id === topupId);
      if (topup) {
        topup.status = 'REJECTED';
        topup.updatedAt = new Date().toISOString();
        
        // Update stats
        this.topupStats!.pendingRequests--;
        this.topupStats!.rejectedRequests++;
        this.pendingTopupsCount = this.topupStats!.pendingRequests;
        
        this.toastService.success(`Topup request #${topupId} rejected.`);
      }
      this.isProcessingTopup = false;
      this.closeTopupProofModal();
    }, 1000);
  }

  deleteTopup(topupId: string) {
    if (confirm('Are you sure you want to delete this topup request?')) {
      const topup = this.topups.find(t => t.id === topupId);
      if (topup) {
        // Update stats before removing
        if (topup.status === 'PENDING') {
          this.topupStats!.pendingRequests--;
          this.pendingTopupsCount = this.topupStats!.pendingRequests;
        } else if (topup.status === 'APPROVED') {
          this.topupStats!.approvedRequests--;
        } else if (topup.status === 'REJECTED') {
          this.topupStats!.rejectedRequests--;
        }
        this.topupStats!.totalRequests--;
        
        // Remove from array
        this.topups = this.topups.filter(t => t.id !== topupId);
        
        this.toastService.success(`Topup request #${topupId} deleted.`);
      }
    }
  }

  viewTopupProof(topup: TopupRequest) {
    this.selectedTopupForProof = topup;
    this.showTopupProofModal = true;
  }

  closeTopupProofModal() {
    this.showTopupProofModal = false;
    this.selectedTopupForProof = null;
  }

  getTopupProofUrl(proofUrl: string): string {
    // In a real implementation, this would construct the full URL
    return proofUrl;
  }

  getTopupStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getTopupStatusText(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'APPROVED':
        return 'Approved';
      case 'REJECTED':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  }
}
