import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { VouchService, Vouch, VouchResponse } from '../service/vouch/vouch.service';

@Component({
  selector: 'app-voucher',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './voucher.html',
  styleUrl: './voucher.css'
})
export class Voucher implements OnInit {
  vouches: Vouch[] = [];
  isLoading = false;
  currentPage = 1;
  totalPages = 1;
  totalVouches = 0;
  itemsPerPage = 10;
  selectedVouch: Vouch | null = null;
  showImageModal = false;
  Math = Math; // Make Math available in template

  constructor(
    private vouchService: VouchService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.loadVouches();
  }

  loadVouches(page: number = 1) {
    this.isLoading = true;
    this.currentPage = page;

    this.vouchService.getApprovedVouches(page, this.itemsPerPage).subscribe({
      next: (response: VouchResponse) => {
        this.vouches = response.vouches;
        this.totalPages = response.totalPages;
        this.totalVouches = response.total;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading vouches:', error);
        this.toastService.error('Failed to load vouches');
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.loadVouches(page);
    }
  }

  getAvatarUrl(avatarSeed: string): string {
    return this.vouchService.getAvatarUrl(avatarSeed);
  }

  formatDate(dateString: string): string {
    return this.vouchService.formatDate(dateString);
  }

  getRatingStars(rating: number): { filled: number[]; empty: number[] } {
    const stars = this.vouchService.getRatingStars(rating);
    return {
      filled: Array(stars.filled).fill(0),
      empty: Array(stars.empty).fill(0)
    };
  }

  showImage(vouch: Vouch) {
    if (vouch.reviewImage) {
      this.selectedVouch = vouch;
      this.showImageModal = true;
    }
  }

  closeImageModal() {
    this.showImageModal = false;
    this.selectedVouch = null;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'APPROVED':
        return 'badge bg-success';
      case 'PENDING':
        return 'badge bg-warning';
      case 'REJECTED':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  getVerifiedBadgeClass(isVerified: boolean): string {
    return isVerified ? 'badge bg-primary' : 'badge bg-secondary';
  }

  // Generate page numbers for pagination
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
      const end = Math.min(this.totalPages, start + maxVisiblePages - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  }
}
