import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  balance: number;
  isActive: boolean;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface UpdateBalanceRequest {
  userId: string;
  amount: number;
  type: 'ADD' | 'SUBTRACT';
  reason: string;
}

export interface BalanceHistory {
  id: string;
  userId: string;
  amount: number;
  type: 'ADD' | 'SUBTRACT';
  reason: string;
  previousBalance: number;
  newBalance: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = `${environment.apiUrl}/users`;
  private userBalanceSubject = new BehaviorSubject<number>(0);
  public userBalance$ = this.userBalanceSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Get user profile including balance
  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/profile`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      tap(profile => {
        this.userBalanceSubject.next(profile.balance);
      })
    );
  }

  // Get current user balance
  getCurrentBalance(): number {
    return this.userBalanceSubject.value;
  }

  // Update user balance (for admin use)
  updateUserBalance(request: UpdateBalanceRequest): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${this.baseUrl}/${request.userId}/balance`, request, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      tap(profile => {
        // Update the balance subject if it's the current user
        if (profile.id === this.authService.currentUser?.id) {
          this.userBalanceSubject.next(profile.balance);
        }
      })
    );
  }

  // Add funds to user account (for topup approval)
  addFundsToUser(userId: string, amount: number, reason: string = 'Topup approved'): Observable<UserProfile> {
    const request: UpdateBalanceRequest = {
      userId,
      amount,
      type: 'ADD',
      reason
    };
    return this.updateUserBalance(request);
  }

  // Subtract funds from user account (for purchases)
  subtractFundsFromUser(userId: string, amount: number, reason: string = 'Purchase'): Observable<UserProfile> {
    const request: UpdateBalanceRequest = {
      userId,
      amount,
      type: 'SUBTRACT',
      reason
    };
    return this.updateUserBalance(request);
  }

  // Get balance history for a user
  getBalanceHistory(userId: string): Observable<BalanceHistory[]> {
    return this.http.get<BalanceHistory[]>(`${this.baseUrl}/${userId}/balance-history`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Refresh user balance (for real-time updates)
  refreshBalance(): void {
    if (this.authService.isAuthenticated) {
      this.getUserProfile().subscribe({
        next: (profile) => {
          this.userBalanceSubject.next(profile.balance);
        },
        error: (error) => {
          console.error('Failed to refresh balance:', error);
        }
      });
    }
  }

  // Initialize balance for current user
  initializeBalance(): void {
    if (this.authService.isAuthenticated) {
      this.refreshBalance();
    }
  }
}
