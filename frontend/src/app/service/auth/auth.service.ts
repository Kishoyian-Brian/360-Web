import { Injectable } from "@angular/core";

import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  isActive: boolean;
  createdAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  message?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly API_URL = environment.apiUrl;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_info';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkAuthStatus();
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getStoredUser();

    if (!token || !user) {
      return false;
    }

    if (this.isTokenExpired(token)) {
      console.warn('AuthService: token expired or invalid, clearing session');
      this.clearAuthData();
      this.currentUserSubject.next(null);
      return false;
    }

    return true;
  }

  get isAdmin(): boolean {
    const user = this.currentUser;
    return user ? (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') : false;
  }

  get isSuperAdmin(): boolean {
    const user = this.currentUser;
    return user ? user.role === 'SUPER_ADMIN' : false;
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.setToken(response.access_token);
          this.setUser(response.user);
          this.currentUserSubject.next(response.user);
        }),
        catchError(error => {
          console.error('Login error:', error);
          throw error;
        })
      );
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/register`, userData)
      .pipe(
        tap(response => {
          console.log('Registration successful:', response);
        }),
        catchError(error => {
          console.error('Registration error:', error);
          throw error;
        })
      );
  }

  logout(): void {
    this.clearAuthData();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private checkAuthStatus(): void {
    const token = this.getToken();
    const user = this.getStoredUser();
    
    if (token && user) {
      // Set the user immediately from localStorage to prevent logout on refresh
      this.currentUserSubject.next(user);
      
      // Optionally verify token with backend (but don't clear auth if it fails)
      this.verifyToken(token).subscribe({
        next: (response) => {
          // Update user data if verification succeeds
          this.setUser(response.user);
          this.currentUserSubject.next(response.user);
        },
        error: (error) => {
          console.warn('Token verification failed, but keeping user logged in:', error);
          // Don't clear auth data on verification failure
          // User stays logged in with localStorage data
        }
      });
    }
  }

  private verifyToken(token: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/verify`, { token })
      .pipe(
        catchError(error => {
          console.error('Token verification failed:', error);
          throw error;
        })
      );
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private getStoredUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  private clearUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  private clearAuthData(): void {
    this.clearToken();
    this.clearUser();
  }

  private isTokenExpired(token: string): boolean {
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        return true;
      }

      const payload = JSON.parse(atob(tokenParts[1]));
      if (!payload?.exp) {
        return false;
      }

      const expiration = payload.exp * 1000;
      return Date.now() >= expiration;
    } catch (error) {
      console.warn('AuthService: failed to decode token for expiration check', error);
      return true;
    }
  }

  getAuthHeaders(): { [key: string]: string } {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  handleLoginResponse(response: LoginResponse): void {
    const user = response.user;
    
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/my-account']);
    }
  }

  refreshUserData(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/auth/profile`)
      .pipe(
        tap(user => {
          this.setUser(user);
          this.currentUserSubject.next(user);
        }),
        catchError(error => {
          console.error('Failed to refresh user data:', error);
          throw error;
        })
      );
  }

  // Method to manually check and restore auth status
  restoreAuthStatus(): void {
    this.checkAuthStatus();
  }
}
