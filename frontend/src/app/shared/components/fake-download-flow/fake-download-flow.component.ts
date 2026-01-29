import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fake-download-flow',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fake-download-flow.component.html'
})
export class FakeDownloadFlowComponent implements OnChanges, OnDestroy {
  /** Simulated gating flags (provided by parent) */
  @Input() hasPaid: boolean = false;
  @Input() hasUploadedProof: boolean = false;
  @Input() isAdminApproved: boolean = true;

  /** Email destination + product info for mailto body */
  @Input() adminEmail: string = 'admin@example.com';
  @Input() productInfo: string = '';

  /** Required state variables */
  showButton: boolean = false;
  showModal: boolean = false;
  isPending: boolean = false;
  showContactMessage: boolean = false;

  /** Modal state */
  email: string = '';
  emailError: string = '';

  private pendingTimeoutId: number | null = null;

  private readonly emailRegex: RegExp =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['hasPaid'] ||
      changes['hasUploadedProof'] ||
      changes['isAdminApproved']
    ) {
      this.showButton =
        !!this.hasPaid && !!this.hasUploadedProof && !!this.isAdminApproved;
    }
  }

  ngOnDestroy(): void {
    this.clearPendingTimer();
  }

  openModal(): void {
    if (!this.showButton) return;
    this.showModal = true;
    this.email = '';
    this.emailError = '';
  }

  closeModal(): void {
    this.showModal = false;
    this.emailError = '';
  }

  validateEmail(): boolean {
    const value = (this.email || '').trim();
    if (!value) {
      this.emailError = 'Email is required';
      return false;
    }
    if (!this.emailRegex.test(value)) {
      this.emailError = 'Please enter a valid email address';
      return false;
    }
    this.emailError = '';
    return true;
  }

  submitAndRequestDownload(): void {
    if (!this.validateEmail()) return;

    // Trigger mailto to admin
    const subject = encodeURIComponent('Download Request');
    const body = encodeURIComponent(
      `Hello Admin,\n\n` +
        `A user has requested a download.\n\n` +
        `User Email: ${(this.email || '').trim()}\n\n` +
        `Product Info:\n${this.productInfo || '(none)'}\n\n` +
        `Time: ${new Date().toISOString()}\n`
    );
    const mailtoLink = `mailto:${this.adminEmail}?subject=${subject}&body=${body}`;

    // Close modal, then show pending state for exactly 5 seconds
    this.closeModal();
    window.open(mailtoLink, '_blank');

    this.showContactMessage = false;
    this.isPending = true;
    this.clearPendingTimer();
    this.pendingTimeoutId = window.setTimeout(() => {
      this.isPending = false;
      this.showContactMessage = true;
      this.pendingTimeoutId = null;
    }, 5000);
  }

  private clearPendingTimer(): void {
    if (this.pendingTimeoutId !== null) {
      window.clearTimeout(this.pendingTimeoutId);
      this.pendingTimeoutId = null;
    }
  }
}

