import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RequirementService } from '../../../core/services/requirement.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-user-rfq',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="py-12 px-6 max-w-3xl mx-auto">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
        <div>
          <span class="px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
            Direct Engineering Inquiry
          </span>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">Technical Quotation & RFQ Form</h1>
          <p class="text-xs text-slate-500 mt-1">Submit your engineering specs for HDPE pipes, SDR ratings, and compounding requirements.</p>
        </div>

        <form [formGroup]="rfqForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold mb-1">Full Name *</label>
              <input formControlName="fullName" type="text" placeholder="e.g. Ramesh Patel" class="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
            </div>
            <div>
              <label class="block text-xs font-semibold mb-1">Company / Organization</label>
              <input formControlName="companyName" type="text" placeholder="e.g. Gujarat Polymer Infra Ltd" class="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold mb-1">Email Address *</label>
              <input formControlName="email" type="email" placeholder="contact@example.com" class="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
            </div>
            <div>
              <label class="block text-xs font-semibold mb-1">Phone Number *</label>
              <input formControlName="phoneNumber" type="tel" placeholder="+91 98765 43210" class="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold mb-1">Product of Interest</label>
              <input formControlName="productOfInterest" type="text" placeholder="e.g. HDPE PN16 Pipes" class="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
            </div>
            <div>
              <label class="block text-xs font-semibold mb-1">Estimated Quantity</label>
              <input formControlName="quantity" type="text" placeholder="e.g. 5,000 meters" class="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold mb-1">Technical Requirement Details *</label>
            <textarea formControlName="requirementDescription" rows="4" placeholder="Detail diameter requirements, SDR ratings, operating temperatures, or custom extrusion requests..." class="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"></textarea>
          </div>

          <button 
            type="submit" 
            [disabled]="loading()"
            class="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md transition-colors disabled:opacity-50"
          >
            {{ loading() ? 'Submitting to Engineering Team...' : 'Transmit Technical Specification' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class UserRfqComponent {
  private fb = inject(FormBuilder);
  private reqService = inject(RequirementService);
  private toast = inject(ToastService);

  loading = signal(false);

  rfqForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.maxLength(150)]],
    companyName: [''],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(20)]],
    productOfInterest: ['HDPE PN16 Pipes'],
    quantity: [''],
    requirementDescription: ['', [Validators.required, Validators.minLength(5)]]
  });

  onSubmit(): void {
    if (this.rfqForm.invalid) {
      this.rfqForm.markAllAsTouched();
      this.toast.error('Please complete all required fields correctly.');
      return;
    }

    this.loading.set(true);
    this.reqService.submitRequirement(this.rfqForm.value).subscribe({
      next: res => {
        this.loading.set(false);
        this.toast.success(res.message);
        this.rfqForm.reset({ productOfInterest: 'HDPE PN16 Pipes' });
      },
      error: () => this.loading.set(false)
    });
  }
}
