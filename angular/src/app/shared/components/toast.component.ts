import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <div 
        *ngFor="let toast of toastService.messages()" 
        class="pointer-events-auto p-3.5 rounded-xl shadow-xl border text-xs flex items-start gap-3 transition-all"
        [ngClass]="{
          'bg-emerald-950/95 border-emerald-700 text-emerald-200': toast.type === 'success',
          'bg-rose-950/95 border-rose-700 text-rose-200': toast.type === 'error',
          'bg-blue-950/95 border-blue-700 text-blue-200': toast.type === 'info',
          'bg-amber-950/95 border-amber-700 text-amber-200': toast.type === 'warning'
        }"
      >
        <div class="text-base shrink-0">
          <span *ngIf="toast.type === 'success'">✅</span>
          <span *ngIf="toast.type === 'error'">⚠️</span>
          <span *ngIf="toast.type === 'info'">ℹ️</span>
          <span *ngIf="toast.type === 'warning'">⚡</span>
        </div>
        <div class="flex-1">
          <div *ngIf="toast.title" class="font-bold text-white mb-0.5">{{ toast.title }}</div>
          <div>{{ toast.message }}</div>
        </div>
        <button 
          (click)="toastService.remove(toast.id)"
          class="text-white/60 hover:text-white font-bold p-0.5 ml-1"
        >
          ✕
        </button>
      </div>
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);
}
