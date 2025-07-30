import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div 
        *ngFor="let toast of toasts" 
        class="toast-item"
        [ngClass]="getToastClasses(toast.type)"
      >
        <div class="toast-content">
          <div class="toast-icon">
            <svg 
              *ngIf="toast.type === 'success'" 
              class="toast-svg success" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <svg 
              *ngIf="toast.type === 'error'" 
              class="toast-svg error" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <svg 
              *ngIf="toast.type === 'warning'" 
              class="toast-svg warning" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <svg 
              *ngIf="toast.type === 'info'" 
              class="toast-svg info" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="toast-message">
            <p>{{ toast.message }}</p>
          </div>
          <button
            (click)="removeToast(toast.id)"
            class="toast-close"
            title="Close notification"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
        <div class="toast-progress" [ngClass]="'progress-' + toast.type"></div>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      max-width: 350px;
      width: 100%;
    }

    .toast-item {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      margin-bottom: 12px;
      overflow: hidden;
      position: relative;
      animation: slideInRight 0.3s ease-out;
      border-left: 4px solid;
    }

    .toast-item.success {
      border-left-color: #10b981;
    }

    .toast-item.error {
      border-left-color: #ef4444;
    }

    .toast-item.warning {
      border-left-color: #f59e0b;
    }

    .toast-item.info {
      border-left-color: #3b82f6;
    }

    .toast-content {
      display: flex;
      align-items: flex-start;
      padding: 16px;
      gap: 12px;
    }

    .toast-icon {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .toast-svg {
      width: 20px;
      height: 20px;
    }

    .toast-svg.success {
      color: #10b981;
    }

    .toast-svg.error {
      color: #ef4444;
    }

    .toast-svg.warning {
      color: #f59e0b;
    }

    .toast-svg.info {
      color: #3b82f6;
    }

    .toast-message {
      flex: 1;
      min-width: 0;
    }

    .toast-message p {
      margin: 0;
      font-size: 14px;
      font-weight: 500;
      color: #1f2937;
      line-height: 1.4;
      word-wrap: break-word;
    }

    .toast-close {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      border: none;
      background: transparent;
      color: #9ca3af;
      cursor: pointer;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .toast-close:hover {
      background: #f3f4f6;
      color: #6b7280;
    }

    .toast-close svg {
      width: 16px;
      height: 16px;
    }

    .toast-progress {
      height: 3px;
      width: 100%;
      background: #e5e7eb;
      position: absolute;
      bottom: 0;
      left: 0;
      animation: progressShrink 3s linear forwards;
    }

    .progress-success {
      background: #10b981;
    }

    .progress-error {
      background: #ef4444;
    }

    .progress-warning {
      background: #f59e0b;
    }

    .progress-info {
      background: #3b82f6;
    }

    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }

    @keyframes progressShrink {
      from {
        width: 100%;
      }
      to {
        width: 0%;
      }
    }

    .toast-item.removing {
      animation: slideOutRight 0.3s ease-in forwards;
    }

    /* Responsive design */
    @media (max-width: 480px) {
      .toast-container {
        right: 10px;
        left: 10px;
        max-width: none;
      }
      
      .toast-item {
        margin-bottom: 8px;
      }
      
      .toast-content {
        padding: 12px;
      }
      
      .toast-message p {
        font-size: 13px;
      }
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private interval: any;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    // Update toasts every 100ms
    this.interval = setInterval(() => {
      this.toasts = this.toastService.getToasts();
    }, 100);
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  removeToast(id: number) {
    // Add removing class for animation
    const toastElement = document.querySelector(`[data-toast-id="${id}"]`) as HTMLElement;
    if (toastElement) {
      toastElement.classList.add('removing');
      setTimeout(() => {
        this.toastService.remove(id);
      }, 300);
    } else {
      this.toastService.remove(id);
    }
  }

  getToastClasses(type: string): string {
    return type;
  }
} 