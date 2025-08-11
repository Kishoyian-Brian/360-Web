import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../service/auth/auth.service';
import { UserService, UserProfile, BalanceHistory } from '../service/user/user';
import { Subscription } from 'rxjs';

interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  status: string;
}

@Component({
  selector: 'app-my-account',
  imports: [CommonModule],
  templateUrl: './my-account.html',
  styleUrl: './my-account.css'
})
export class MyAccountComponent implements OnInit, OnDestroy {
  user: User | null = null;
  isLoggedIn = false;
  isLoading = false;
  isLoadingBalanceHistory = false;
  balanceHistory: BalanceHistory[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 1;
  Math = Math; // Make Math available in template
  private balanceSubscription?: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.checkAuthentication();
    this.loadUserData();
    this.initializeBalanceSubscription();
    // Initialize balance when component loads
    this.userService.initializeBalance();
    // Load balance history after user data is loaded
    setTimeout(() => {
      this.loadBalanceHistory();
    }, 1000);
    
    // Refresh balance periodically to catch updates from admin actions
    setInterval(() => {
      if (this.authService.isAuthenticated) {
        this.userService.refreshBalance();
      }
    }, 30000); // Refresh every 30 seconds
  }

  ngOnDestroy() {
    if (this.balanceSubscription) {
      this.balanceSubscription.unsubscribe();
    }
  }

  @HostListener('window:focus')
  onWindowFocus() {
    // Refresh balance when user returns to the tab
    if (this.authService.isAuthenticated) {
      this.userService.refreshBalance();
    }
  }

  checkAuthentication() {
    // Check if user is logged in using AuthService
    if (!this.authService.isAuthenticated) {
      // Redirect to login if not authenticated
      this.router.navigate(['/login']);
      return;
    }
    this.isLoggedIn = true;
  }

  loadUserData() {
    this.isLoading = true;
    // Load user data from AuthService and UserService
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      this.user = {
        id: currentUser.id,
        username: currentUser.username,
        email: currentUser.email,
        balance: this.userService.getCurrentBalance(), // Get real balance from service
        status: currentUser.isActive ? 'Active' : 'Inactive'
      };
      
      // Load user profile with balance from API
      this.userService.getUserProfile().subscribe({
        next: (profile: UserProfile) => {
          this.user = {
            id: profile.id,
            username: profile.username,
            email: profile.email,
            balance: profile.balance, // Real balance from API
            status: profile.isActive ? 'Active' : 'Inactive'
          };
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Failed to load user profile:', error);
          // Fallback to auth service data
          this.user = {
            id: currentUser.id,
            username: currentUser.username,
            email: currentUser.email,
            balance: 0, // Default to 0 if API fails
            status: currentUser.isActive ? 'Active' : 'Inactive'
          };
          this.isLoading = false;
        }
      });
    } else {
      // Mock user data for demonstration
      this.user = {
        id: '1',
        username: 'peter',
        email: 'peter@example.com',
        balance: 0,
        status: 'Active'
      };
      this.isLoading = false;
    }
  }

  initializeBalanceSubscription() {
    // Subscribe to balance updates
    this.balanceSubscription = this.userService.userBalance$.subscribe(balance => {
      if (this.user) {
        this.user.balance = balance;
      }
    });
  }

  onTopup() {
    this.router.navigate(['/topup']);
  }

  onPurchase() {
    // Handle purchase functionality
    console.log('Purchase clicked');
    this.router.navigate(['/shop']);
  }

  onProfile() {
    // Handle profile functionality
    console.log('Profile clicked');
    // Show profile information (already visible in the main content)
    // Could navigate to a dedicated profile page in the future
  }

  onLogout() {
    // Handle logout functionality using AuthService
    console.log('Logout clicked');
    this.authService.logout();
    this.isLoggedIn = false;
    this.user = null;
  }

  onAddFunds() {
    // Handle add funds functionality
    console.log('Add funds clicked');
    this.onTopup();
  }

  onViewOrders() {
    // Handle view orders functionality
    console.log('View orders clicked');
    // You can navigate to an orders page
  }

  onUpdateProfile() {
    // Handle update profile functionality
    console.log('Edit profile clicked');
    // Could show a profile edit modal or navigate to edit page
    // For now, just show a message
    alert('Profile editing feature will be implemented soon!');
  }

  // Balance History Methods
  loadBalanceHistory() {
    if (!this.user) return;
    
    this.isLoadingBalanceHistory = true;
    this.userService.getBalanceHistory(this.user.id, this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        this.balanceHistory = response.history;
        this.totalItems = response.total;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.isLoadingBalanceHistory = false;
      },
      error: (error) => {
        console.error('Failed to load balance history:', error);
        this.isLoadingBalanceHistory = false;
      }
    });
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadBalanceHistory();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadBalanceHistory();
    }
  }

  getTransactionTypeClass(type: string): string {
    switch (type) {
      case 'ADD':
      case 'PAYMENT_APPROVAL':
      case 'TOPUP_APPROVAL':
      case 'REFUND':
        return 'bg-green-100 text-green-800';
      case 'SUBTRACT':
      case 'PURCHASE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  refreshBalance() {
    this.userService.refreshBalance();
    this.loadBalanceHistory();
  }
}
