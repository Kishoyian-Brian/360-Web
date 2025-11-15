import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { QrCodeService } from '../../services/qr-code.service';

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
  qrCode?: string; // QR code data URL
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

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private qrCodeService: QrCodeService
  ) {}

  // Get all crypto accounts
  getAllAccounts(): Observable<CryptoAccount[]> {
    return this.http.get<CryptoAccount[]>(this.baseUrl).pipe(
      switchMap(accounts => {
        // Generate QR codes for all accounts and wait for completion
        return from(this.generateQRCodesForAccounts(accounts)).pipe(
          tap(() => this.cryptoAccountsSubject.next(accounts)),
          switchMap(() => of(accounts)) // Return accounts after QR codes are generated
        );
      })
    );
  }

  // Get active crypto accounts only
  getActiveAccounts(): Observable<CryptoAccount[]> {
    return this.http.get<CryptoAccount[]>(`${this.baseUrl}/active`).pipe(
      switchMap(accounts => {
        // Generate QR codes for active accounts and wait for completion
        return from(this.generateQRCodesForAccounts(accounts)).pipe(
          switchMap(() => of(accounts)) // Return accounts after QR codes are generated
        );
      })
    );
  }

  // Get single crypto account
  getAccount(id: string): Observable<CryptoAccount> {
    return this.http.get<CryptoAccount>(`${this.baseUrl}/${id}`);
  }

  // Create new crypto account (Admin only)
  createAccount(account: CreateCryptoAccountRequest): Observable<CryptoAccount> {
    return this.http.post<CryptoAccount>(this.baseUrl, account, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      tap(() => this.refreshAccounts())
    );
  }

  // Update crypto account (Admin only)
  updateAccount(id: string, account: UpdateCryptoAccountRequest): Observable<CryptoAccount> {
    return this.http.patch<CryptoAccount>(`${this.baseUrl}/${id}`, account, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      tap(() => this.refreshAccounts())
    );
  }

  // Delete crypto account (Admin only)
  deleteAccount(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      tap(() => this.refreshAccounts())
    );
  }

  // Seed default accounts (Admin only)
  seedDefaultAccounts(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/seed`, {}, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
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

  // Generate QR codes for multiple accounts
  private async generateQRCodesForAccounts(accounts: CryptoAccount[]): Promise<void> {
    for (const account of accounts) {
      if (account.address && !account.qrCode) {
        try {
          account.qrCode = await this.qrCodeService.generateCryptoQRCode(account.address, account.symbol);
        } catch (error) {
          console.error(`Failed to generate QR code for ${account.symbol}:`, error);
        }
      }
    }
  }

  // Generate QR code for a single account
  async generateQRCodeForAccount(account: CryptoAccount): Promise<string> {
    if (!account.address) {
      throw new Error('Account address is required to generate QR code');
    }
    
    try {
      return await this.qrCodeService.generateCryptoQRCode(account.address, account.symbol);
    } catch (error) {
      console.error(`Failed to generate QR code for ${account.symbol}:`, error);
      throw error;
    }
  }

  // Generate payment QR code with amount
  async generatePaymentQRCode(account: CryptoAccount, amount: number): Promise<string> {
    if (!account.address) {
      throw new Error('Account address is required to generate payment QR code');
    }
    
    try {
      return await this.qrCodeService.generatePaymentQRCode(account.address, amount, account.symbol);
    } catch (error) {
      console.error(`Failed to generate payment QR code for ${account.symbol}:`, error);
      throw error;
    }
  }

  // Validate crypto address format
  isValidCryptoAddress(address: string): boolean {
    return this.qrCodeService.isValidCryptoAddress(address);
  }
}
