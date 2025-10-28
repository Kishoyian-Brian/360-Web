import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  private toastIdCounter = 0;

  constructor() {}

  // Show a toast message
  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 5000): string {
    const id = `toast-${++this.toastIdCounter}`;
    const toast: Toast = {
      id,
      message,
      type,
      duration,
      timestamp: new Date()
    };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }

    return id;
  }

  // Show success toast
  success(message: string, duration?: number): string {
    return this.show(message, 'success', duration);
  }

  // Show error toast
  error(message: string, duration?: number): string {
    return this.show(message, 'error', duration);
  }

  // Show warning toast
  warning(message: string, duration?: number): string {
    return this.show(message, 'warning', duration);
  }

  // Show info toast
  info(message: string, duration?: number): string {
    return this.show(message, 'info', duration);
  }

  // Remove a specific toast
  remove(id: string): void {
    const currentToasts = this.toastsSubject.value;
    const updatedToasts = currentToasts.filter(toast => toast.id !== id);
    this.toastsSubject.next(updatedToasts);
  }

  // Clear all toasts
  clear(): void {
    this.toastsSubject.next([]);
  }

  // Get current toasts
  getToasts(): Toast[] {
    return this.toastsSubject.value;
  }
}
