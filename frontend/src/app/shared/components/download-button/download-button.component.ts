import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-download-button',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Download Button (shown after payment proof) -->
    <button
      *ngIf="showDownloadButton"
      (click)="openEmailModal()"
      class="neon-button px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all duration-300"
      style="min-height: 44px;"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
      </svg>
      <span>Download</span>
    </button>

    <!-- Email Modal (styled like approval modal) -->
    <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" (click)="closeModal()"></div>

      <!-- Modal Panel -->
      <div class="relative w-full max-w-md rounded-xl border border-cyan-500/40 bg-gray-900 shadow-2xl"
           style="box-shadow: 0 0 30px rgba(0, 255, 255, 0.2);">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-cyan-500/30"
             style="background: linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(157, 0, 255, 0.1));">
          <h3 class="text-lg font-semibold text-cyan-200" id="modal-title">
            Verify Email for Download
          </h3>
        </div>

        <!-- Modal Body -->
        <div class="px-6 py-6">
          <!-- Pending State -->
          <div *ngIf="isPending" class="text-center py-4">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4 neon-spinner"></div>
            <p class="neon-text mb-2">Processing your request...</p>
            <p class="text-sm text-gray-400">Please wait {{ pendingSeconds }} seconds</p>
          </div>

          <!-- Success State -->
          <div *ngIf="isSuccess" class="text-center py-4">
            <svg class="w-16 h-16 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="filter: drop-shadow(0 0 10px #4ade80);">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-green-400 text-lg font-medium mb-2" style="text-shadow: 0 0 10px #4ade80;">
              Request Submitted!
            </p>
            <p class="text-gray-300 text-sm">
              Contact the admin to complete your download verification.
            </p>
            <p class="text-gray-400 text-xs mt-3">
              Admin Email: admin&#64;example.com
            </p>
          </div>

          <!-- Email Input Form -->
          <div *ngIf="!isPending && !isSuccess">
            <p class="text-gray-300 text-sm mb-4">
              Please enter your email address to receive the download link.
            </p>
            
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-cyan-200 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                [(ngModel)]="email"
                (input)="validateEmail()"
                (blur)="validateEmail()"
                placeholder="your.email&#64;example.com"
                class="w-full px-4 py-3 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                [class.border-red-500]="emailError"
                [class.border-green-500]="emailValid && email.length > 0"
                [class.border-cyan-500]="!emailError && email.length === 0"
                style="min-height: 44px;"
              />
              <p *ngIf="emailError" class="mt-2 text-sm text-red-400" style="text-shadow: 0 0 5px #ef4444;">
                {{ emailError }}
              </p>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-cyan-500/30 flex justify-end space-x-3"
             style="background: linear-gradient(135deg, rgba(0, 255, 255, 0.05), rgba(157, 0, 255, 0.05));">
          <button
            *ngIf="!isPending && !isSuccess"
            (click)="closeModal()"
            class="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
            style="min-height: 44px; min-width: 80px;"
          >
            Cancel
          </button>

          <button
            *ngIf="!isPending && !isSuccess"
            (click)="submitEmail()"
            [disabled]="!isEmailValid()"
            class="neon-button px-6 py-2 rounded-lg font-medium flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style="min-height: 44px; min-width: 100px;"
          >
            <svg *ngIf="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 neon-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isSubmitting ? 'Sending...' : 'Submit' }}
          </button>

          <button
            *ngIf="isSuccess"
            (click)="closeModal()"
            class="neon-button px-6 py-2 rounded-lg font-medium"
            style="min-height: 44px; min-width: 100px;"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  `
})
export class DownloadButtonComponent {
  @Input() showDownloadButton: boolean = false;
  @Input() downloadUrl: string = '';
  @Input() adminEmail: string = 'alfredkaizen30@gmail.com';
  @Input() productName: string = 'Product';
  
  @Output() downloadRequested = new EventEmitter<{email: string; productName: string}>();

  showModal: boolean = false;
  email: string = '';
  emailError: string = '';
  emailValid: boolean = false;
  isPending: boolean = false;
  isSuccess: boolean = false;
  isSubmitting: boolean = false;
  pendingSeconds: number = 5;

  // Email validation regex
  private emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  openEmailModal() {
    this.showModal = true;
    this.email = '';
    this.emailError = '';
    this.emailValid = false;
    this.isPending = false;
    this.isSuccess = false;
    this.isSubmitting = false;
  }

  closeModal() {
    this.showModal = false;
    this.resetState();
  }

  validateEmail() {
    if (!this.email || this.email.trim() === '') {
      this.emailError = 'Email is required';
      this.emailValid = false;
      return;
    }

    if (!this.emailRegex.test(this.email)) {
      this.emailError = 'Please enter a valid email address';
      this.emailValid = false;
      return;
    }

    this.emailError = '';
    this.emailValid = true;
  }

  isEmailValid(): boolean {
    return this.emailValid && this.email.trim() !== '';
  }

  submitEmail() {
    this.validateEmail();

    if (!this.isEmailValid()) {
      return;
    }

    this.isSubmitting = true;

    // Simulate submission delay
    setTimeout(() => {
      this.isSubmitting = false;
      this.startPendingState();
    }, 1000);
  }

  startPendingState() {
    this.isPending = true;
    this.pendingSeconds = 5;

    const countdownInterval = setInterval(() => {
      this.pendingSeconds--;
      if (this.pendingSeconds <= 0) {
        clearInterval(countdownInterval);
        this.completeRequest();
      }
    }, 1000);
  }

  completeRequest() {
    this.isPending = false;
    this.isSuccess = true;

    // Emit the download request
    this.downloadRequested.emit({
      email: this.email,
      productName: this.productName
    });

    // Trigger mailto to admin
    const subject = encodeURIComponent(`Download Request - ${this.productName}`);
    const body = encodeURIComponent(
      `Hello Admin,\n\n` +
      `A user has requested download access for:\n` +
      `Product: ${this.productName}\n` +
      `Email: ${this.email}\n` +
      `Time: ${new Date().toISOString()}\n\n` +
      `Please verify the payment and provide the download link.`
    );
    
    // Open mailto link in new window (hidden trigger)
    const mailtoLink = `mailto:${this.adminEmail}?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');
  }

  resetState() {
    this.email = '';
    this.emailError = '';
    this.emailValid = false;
    this.isPending = false;
    this.isSuccess = false;
    this.isSubmitting = false;
  }
}

