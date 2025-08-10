import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../service/auth/auth.service';

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
export class MyAccountComponent implements OnInit {
  user: User | null = null;
  isLoggedIn = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.checkAuthentication();
    this.loadUserData();
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
    // Load user data from AuthService
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      this.user = {
        id: parseInt(currentUser.id),
        username: currentUser.username,
        email: currentUser.email,
        balance: 0, // You can get this from API later
        status: currentUser.isActive ? 'Active' : 'Inactive'
      };
    } else {
      // Mock user data for demonstration
      this.user = {
        id: 1,
        username: 'peter',
        email: 'peter@example.com',
        balance: 0,
        status: 'Active'
      };
    }
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
