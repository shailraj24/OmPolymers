import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div class="text-center mb-6">
          <div class="w-12 h-12 rounded-xl bg-blue-600 mx-auto flex items-center justify-center text-xl font-bold mb-3">
            OM
          </div>
          <h2 class="text-lg font-bold">Admin Portal Login</h2>
          <p class="text-xs text-slate-400 mt-1">OM Polymer Management Console</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Email</label>
            <input formControlName="email" type="email" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input formControlName="password" type="password" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs" />
          </div>

          <div class="p-3 bg-slate-950/60 rounded border border-slate-800 text-[11px] text-slate-400">
            <div>Seed Credentials: <span class="text-blue-400 font-mono">admin&#64;ompolymer.com</span></div>
            <div>Password: <span class="text-blue-400 font-mono">Admin&#64;123</span></div>
          </div>

          <button 
            type="submit" 
            [disabled]="loading()"
            class="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs transition-colors disabled:opacity-50"
          >
            {{ loading() ? 'Authenticating...' : 'Sign In' }}
          </button>
        </form>

        <div class="mt-4 text-center">
          <a routerLink="/" class="text-xs text-slate-500 hover:text-slate-300">← Back to Maintenance Page</a>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  loading = signal(false);

  form: FormGroup = this.fb.group({
    email: ['admin@ompolymer.com', [Validators.required, Validators.email]],
    password: ['Admin@123', Validators.required]
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.auth.login(this.form.value).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.toast.success('Authenticated successfully!');
        this.router.navigate(['/admin/inquiries']);
      },
      error: () => this.loading.set(false)
    });
  }
}
