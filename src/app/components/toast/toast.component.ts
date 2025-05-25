import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toasts$ | async; track toast.id) {
        <div class="toast" [ngClass]="toast.type" (click)="removeToast(toast.id)">
          <div class="toast-header">
            <strong>{{ toast.title }}</strong>
            <button class="close-btn" (click)="removeToast(toast.id)">×</button>
          </div>
          <div class="toast-body">
            {{ toast.message }}
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
    }

    .toast {
      background: white;
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      margin-bottom: 10px;
      min-width: 300px;
      max-width: 400px;
      padding: 15px;
      animation: slideIn 0.3s ease-in-out;
      opacity: 1 !important;
      display: block !important;
    }

    .toast-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      padding: 0;
      color: #666;
    }

    .success {
      border-left: 4px solid #28a745;
    }

    .error {
      border-left: 4px solid #dc3545;
    }

    .info {
      border-left: 4px solid #17a2b8;
    }

    .warning {
      border-left: 4px solid #ffc107;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class ToastComponent {
  private toastService = inject(ToastService);
  toasts$ = this.toastService.toasts$;

  removeToast(id: number) {
    this.toastService.remove(id);
  }
} 