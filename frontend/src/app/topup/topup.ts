import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../service/auth/auth.service';
import { CryptoService, CryptoAccount } from '../service/crypto/crypto.service';

export interface TopupRequest {
  amount: number;
  cryptoAccountId: string;
  paymentProof?: File;
}

export interface TopupResponse {
  id: string;
  userId: string;
  amount: number;
  cryptoAccountId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  paymentProofUrl?: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-topup',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './topup.html',
  styleUrl: './topup.css'
})
export class TopupComponent implements OnInit {
  isLoading = false;
  isSubmitting = false;
  paymentProofFile: File | null = null;
  paymentProofPreview: string | null = null;
  
  // Topup form data
  topupAmount = 0;
  selectedCrypto: CryptoAccount | null = null;
  cryptoPayments: CryptoAccount[] = [];
  
  // Generated topup ID
  topupId = '';

  constructor(
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService,
    private cryptoService: CryptoService
  ) { }

  ngOnInit() {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated) {
      this.toastService.error('Please log in to add funds');
      this.router.navigate(['/login']);
      return;
    }

    // Check if user is admin - redirect to admin dashboard
    if (this.authService.isAdmin) {
      this.toastService.error('Admin users cannot add funds');
      this.router.navigate(['/admin']);
      return;
    }

    this.loadCryptoAccounts();
  }

  loadCryptoAccounts() {
    this.isLoading = true;
    this.cryptoService.getActiveAccounts().subscribe({
      next: (accounts) => {
        this.cryptoPayments = accounts;
        if (accounts.length > 0) {
          this.selectedCrypto = accounts[0];
        }
        this.isLoading = false;
        console.log('Loaded crypto accounts:', accounts);
      },
      error: (error) => {
        console.error('Error loading crypto accounts:', error);
        this.toastService.error('Failed to load payment options');
        this.isLoading = false;
      }
    });
  }

  selectCryptoPayment(crypto: CryptoAccount) {
    this.selectedCrypto = crypto;
    console.log('Selected crypto payment:', crypto);
  }

  copyCryptoAddress() {
    if (this.selectedCrypto) {
      navigator.clipboard.writeText(this.selectedCrypto.address).then(() => {
        this.toastService.success('Address copied to clipboard!');
      }).catch(() => {
        this.toastService.error('Failed to copy address');
      });
    }
  }

  getCryptoDisplayName(crypto: CryptoAccount): string {
    return `${crypto.name} (${crypto.symbol})`;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.toastService.error('Please select an image file');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        this.toastService.error('File size must be less than 5MB');
        return;
      }

      this.paymentProofFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.paymentProofPreview = e.target.result;
      };
      reader.readAsDataURL(file);

      console.log('Payment proof file selected:', file.name);
    }
  }

  removePaymentProof() {
    this.paymentProofFile = null;
    this.paymentProofPreview = null;
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  validateForm(): boolean {
    if (this.topupAmount <= 0) {
      this.toastService.error('Please enter a valid amount');
      return false;
    }

    if (!this.selectedCrypto) {
      this.toastService.error('Please select a payment method');
      return false;
    }

    if (!this.paymentProofFile) {
      this.toastService.error('Please upload payment proof');
      return false;
    }

    return true;
  }

  submitTopup() {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('amount', this.topupAmount.toString());
    formData.append('cryptoAccountId', this.selectedCrypto!.id);
    formData.append('paymentProof', this.paymentProofFile!);

    // Here you would typically make an API call to submit the topup
    // For now, I'll simulate the process
    console.log('Submitting topup:', {
      amount: this.topupAmount,
      cryptoAccountId: this.selectedCrypto!.id,
      paymentProof: this.paymentProofFile!.name
    });

    // Simulate API call
    setTimeout(() => {
      this.isSubmitting = false;
      this.topupId = 'TOPUP-' + Date.now();
      this.toastService.success('Topup request submitted successfully!');
      
      // Navigate back to my account
      setTimeout(() => {
        this.router.navigate(['/my-account']);
      }, 2000);
    }, 2000);
  }

  onAmountChange() {
    // Validate amount
    if (this.topupAmount < 0) {
      this.topupAmount = 0;
    }
  }

  goBack() {
    this.router.navigate(['/my-account']);
  }
}
