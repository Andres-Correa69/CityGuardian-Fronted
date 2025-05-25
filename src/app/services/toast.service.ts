import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toasts.asObservable();
  private idCounter = 0;

  show(toast: Omit<Toast, 'id'>) {
    const newToast: Toast = {
      ...toast,
      id: this.idCounter++,
      duration: toast.duration || 5000
    };

    const currentToasts = this.toasts.value;
    this.toasts.next([...currentToasts, newToast]);

    if (newToast.duration) {
      setTimeout(() => {
        this.remove(newToast.id);
      }, newToast.duration);
    }
  }

  remove(id: number) {
    const currentToasts = this.toasts.value;
    this.toasts.next(currentToasts.filter(toast => toast.id !== id));
  }

  success(message: string, title: string = 'Éxito') {
    this.show({ title, message, type: 'success' });
  }

  error(message: string, title: string = 'Error') {
    this.show({ title, message, type: 'error' });
  }

  info(message: string, title: string = 'Información') {
    this.show({ title, message, type: 'info' });
  }

  warning(message: string, title: string = 'Advertencia') {
    this.show({ title, message, type: 'warning' });
  }
} 