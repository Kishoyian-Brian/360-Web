import { Injectable } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: Toast[] = [];
  private nextId = 1;

  getToasts() {
    return this.toasts;
  }

  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 3000) {
    const toast: Toast = {
      id: this.nextId++,
      message,
      type,
      duration
    };

    this.toasts.push(toast);

    // Auto remove after duration (only if duration > 0)
    if (duration > 0) {
      setTimeout(() => {
        this.remove(toast.id);
      }, duration);
    }

    return toast.id;
  }

  success(message: string, duration?: number) {
    return this.show(message, 'success', duration);
  }

  error(message: string, duration?: number) {
    return this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number) {
    return this.show(message, 'warning', duration);
  }

  info(message: string, duration?: number) {
    return this.show(message, 'info', duration);
  }

  remove(id: number) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
  }

  removeAll() {
    this.toasts = [];
  }

  clear() {
    this.toasts = [];
  }

  // Method to show a toast that doesn't auto-remove
  showPersistent(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
    return this.show(message, type, 0); // 0 means no auto-remove
  }
} 