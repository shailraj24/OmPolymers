import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
      <div class="text-center">
        <div class="w-12 h-12 rounded-2xl bg-blue-600 mx-auto flex items-center justify-center text-xl font-bold mb-3 shadow-lg">
          OM
        </div>
        <h1 class="text-xl font-bold text-white">Administrator Sign In</h1>
        <p class="text-xs text-slate-400 mt-1">OM Polymer Management Portal</p>
      </div>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
          <input formControlName="email" type="email" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white" />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Password</label>
          <input formControlName="password" type="password" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white" />
        </div>

        <div class="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-0.5">
          <div class="font-semibold text-slate-300">Seed Administrative Credentials:</div>
          <div>Email: <span class="text-blue-400 font-mono">admin&#64;ompolymer.com</span></div>
          <div>Password: <span class="text-blue-400 font-mono">Admin&#64;123</span></div>
        </div>

        <button 
          type="submit" 
          [disabled]="loading()"
          class="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md transition-colors disabled:opacity-50"
        >
          {{ loading() ? 'Authenticating & Issuing Token...' : 'Authenticate & Enter' }}
        </button>
      </form>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  loading = signal(false);

  loginForm: FormGroup = this.fb.group({
    email: ['admin@ompolymer.com', [Validators.required, Validators.email]],
    password: ['Admin@123', Validators.required]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading.set(true);
    this.auth.login(this.loginForm.value).subscribe({
      next: res => {
        this.loading.set(false);
        this.toast.success(`Welcome back, ${res.data.fullName}!`);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: () => this.loading.set(false)
    });
  }
}
