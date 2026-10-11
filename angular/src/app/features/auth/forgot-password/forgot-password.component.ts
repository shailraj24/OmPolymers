import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
      <div class="text-center">
        <h1 class="text-xl font-bold text-white">Reset Administrative Password</h1>
        <p class="text-xs text-slate-400 mt-1">Dispatches a 1-hour secure password reset token</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Registered Administrator Email</label>
          <input formControlName="email" type="email" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white" />
        </div>

        <button type="submit" [disabled]="loading()" class="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-colors disabled:opacity-50">
          {{ loading() ? 'Sending...' : 'Dispatch Reset Token' }}
        </button>
      </form>
    </div>
  `
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  loading = signal(false);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.http.post<any>(`${environment.apiUrl}/admin/auth/forgot-password`, this.form.value).subscribe({
      next: res => {
        this.loading.set(false);
        this.toast.success(res.message);
      },
      error: () => this.loading.set(false)
    });
  }
}
