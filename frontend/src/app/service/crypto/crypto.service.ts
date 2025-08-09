import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface CryptoAccount {
  id: string;
  name: string;
  symbol: string;
  address: string;
  network?: string;
  isActive: boolean;
  order: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCryptoAccountRequest {
  name: string;
  symbol: string;
  address: string;
  network?: string;
  isActive?: boolean;
  order?: number;
  description?: string;
}

export interface UpdateCryptoAccountRequest {
  name?: string;
  symbol?: string;
  address?: string;
  network?: string;
  isActive?: boolean;
  order?: number;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private readonly baseUrl = `${environment.apiUrl}/crypto`;
  private cryptoAccountsSubject = new BehaviorSubject<CryptoAccount[]>([]);
  
  public cryptoAccounts$ = this.cryptoAccountsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get all crypto accounts
  getAllAccounts(): Observable<CryptoAccount[]> {
    return this.http.get<CryptoAccount[]>(this.baseUrl).pipe(
      tap(accounts => this.cryptoAccountsSubject.next(accounts))
    );
  }

  // Get active crypto accounts only
  getActiveAccounts(): Observable<CryptoAccount[]> {
    return this.http.get<CryptoAccount[]>(`${this.baseUrl}/active`);
  }

  // Get single crypto account
  getAccount(id: string): Observable<CryptoAccount> {
    return this.http.get<CryptoAccount>(`${this.baseUrl}/${id}`);
  }

  // Create new crypto account (Admin only)
  createAccount(account: CreateCryptoAccountRequest): Observable<CryptoAccount> {
    return this.http.post<CryptoAccount>(this.baseUrl, account).pipe(
      tap(() => this.refreshAccounts())
    );
  }

  // Update crypto account (Admin only)
  updateAccount(id: string, account: UpdateCryptoAccountRequest): Observable<CryptoAccount> {
    return this.http.patch<CryptoAccount>(`${this.baseUrl}/${id}`, account).pipe(
      tap(() => this.refreshAccounts())
    );
  }

  // Delete crypto account (Admin only)
  deleteAccount(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.refreshAccounts())
    );
  }

  // Seed default accounts (Admin only)
  seedDefaultAccounts(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/seed`, {}).pipe(
      tap(() => this.refreshAccounts())
    );
  }

  // Refresh accounts list
  private refreshAccounts(): void {
    this.getAllAccounts().subscribe();
  }

  // Get current accounts from subject
  getCurrentAccounts(): CryptoAccount[] {
    return this.cryptoAccountsSubject.value;
  }
}
