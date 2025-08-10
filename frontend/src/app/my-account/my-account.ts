import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkAuthentication();
    this.loadUserData();
  }

  checkAuthentication() {
    // Check if user is logged in (you can use your auth service here)
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Redirect to login if not authenticated
      this.router.navigate(['/login']);
      return;
    }
    this.isLoggedIn = true;
  }

  loadUserData() {
    // Load user data from localStorage or API
    const userData = localStorage.getItem('userData');
    if (userData) {
      this.user = JSON.parse(userData);
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
    // Handle topup functionality
    console.log('Topup clicked');
    // You can navigate to a topup page or show a modal
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
    // Handle logout functionality
    console.log('Logout clicked');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    this.isLoggedIn = false;
    this.user = null;
    this.router.navigate(['/login']);
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
