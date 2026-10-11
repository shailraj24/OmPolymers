import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RequirementService } from '../../core/services/requirement.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-requirement-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 md:p-12 flex flex-col justify-center items-center">
      <div class="max-w-2xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl">
        <div class="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h1 class="text-2xl font-bold">Technical Quotation Request</h1>
            <p class="text-xs text-slate-500 mt-1">OM Polymer Engineering Sales Quotation Engine</p>
          </div>
          <a routerLink="/" class="text-xs text-blue-600 hover:underline">← Back to Maintenance</a>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold mb-1">Full Name *</label>
              <input formControlName="fullName" type="text" class="w-full px-3 py-2 text-xs rounded-lg border dark:bg-slate-950 border-slate-300 dark:border-slate-700" />
            </div>
            <div>
              <label class="block text-xs font-semibold mb-1">Company Name</label>
              <input formControlName="companyName" type="text" class="w-full px-3 py-2 text-xs rounded-lg border dark:bg-slate-950 border-slate-300 dark:border-slate-700" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold mb-1">Email Address *</label>
              <input formControlName="email" type="email" class="w-full px-3 py-2 text-xs rounded-lg border dark:bg-slate-950 border-slate-300 dark:border-slate-700" />
            </div>
            <div>
              <label class="block text-xs font-semibold mb-1">Phone Number *</label>
              <input formControlName="phoneNumber" type="tel" class="w-full px-3 py-2 text-xs rounded-lg border dark:bg-slate-950 border-slate-300 dark:border-slate-700" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold mb-1">Requirement & Technical Specs *</label>
            <textarea formControlName="requirementDescription" rows="4" class="w-full px-3 py-2 text-xs rounded-lg border dark:bg-slate-950 border-slate-300 dark:border-slate-700"></textarea>
          </div>

          <button 
            type="submit" 
            [disabled]="loading()"
            class="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs transition-colors disabled:opacity-50"
          >
            {{ loading() ? 'Submitting Requirement...' : 'Send Technical Specification' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class RequirementFormComponent {
  private fb = inject(FormBuilder);
  private reqService = inject(RequirementService);
  private toast = inject(ToastService);

  loading = signal(false);

  form: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.maxLength(150)]],
    companyName: [''],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.minLength(7)]],
    requirementDescription: ['', [Validators.required, Validators.minLength(5)]]
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Please fill required fields.');
      return;
    }
    this.loading.set(true);
    this.reqService.submitRequirement(this.form.value).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.toast.success(res.message);
        this.form.reset();
      },
      error: () => this.loading.set(false)
    });
  }
}
