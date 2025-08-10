import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../service/auth/auth.service';
import { UserService, UserProfile } from '../service/user/user';
import { Subscription } from 'rxjs';

interface User {
  id: number;
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
  }

  ngOnDestroy() {
    if (this.balanceSubscription) {
      this.balanceSubscription.unsubscribe();
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
        id: parseInt(currentUser.id),
        username: currentUser.username,
        email: currentUser.email,
        balance: this.userService.getCurrentBalance(), // Get real balance from service
        status: currentUser.isActive ? 'Active' : 'Inactive'
      };
      
      // Load user profile with balance from API
      this.userService.getUserProfile().subscribe({
        next: (profile: UserProfile) => {
          this.user = {
            id: parseInt(profile.id),
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
            id: parseInt(currentUser.id),
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
        id: 1,
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
    // You can navigate to a profile page or show a modal
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
    console.log('Update profile clicked');
    this.onProfile();
  }
}
