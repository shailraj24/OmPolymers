import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  messages = signal<ToastMessage[]>([]);

  show(toast: Omit<ToastMessage, 'id'>): void {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = {
      ...toast,
      id,
      duration: toast.duration ?? 4500
    };

    this.messages.update(list => [...list, newToast]);

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => this.remove(id), newToast.duration);
    }
  }

  success(message: string, title = 'Success'): void {
    this.show({ type: 'success', title, message });
  }

  error(message: string, title = 'Error'): void {
    this.show({ type: 'error', title, message, duration: 6000 });
  }

  info(message: string, title = 'Notice'): void {
    this.show({ type: 'info', title, message });
  }

  remove(id: string): void {
    this.messages.update(list => list.filter(m => m.id !== id));
  }
}
