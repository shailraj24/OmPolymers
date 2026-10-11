import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyService } from '../../../core/services/company.service';
import { ToastService } from '../../../core/services/toast.service';
import { CompanySettings } from '../../../core/models/company.model';

@Component({
  selector: 'app-admin-company',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 max-w-3xl">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Company Profile & WhatsApp Settings</h1>
        <p class="text-xs text-slate-400 mt-1">Configure company metadata and direct WhatsApp inquiry number</p>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4" *ngIf="settings()">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-400 mb-1">Company Name</label>
            <input type="text" [(ngModel)]="companyName" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-400 mb-1">WhatsApp Phone Number</label>
            <input type="text" [(ngModel)]="whatsAppNumber" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-400 mb-1">Phone Contact</label>
            <input type="text" [(ngModel)]="phoneContact" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-400 mb-1">Email Contact</label>
            <input type="email" [(ngModel)]="emailContact" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-400 mb-1">Factory Address</label>
          <input type="text" [(ngModel)]="address" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" />
        </div>

        <button (click)="saveSettings()" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  `
})
export class AdminCompanyComponent implements OnInit {
  private compService = inject(CompanyService);
  private toast = inject(ToastService);

  settings = signal<CompanySettings | null>(null);

  companyName = '';
  whatsAppNumber = '';
  phoneContact = '';
  emailContact = '';
  address = '';

  ngOnInit(): void {
    this.compService.getCompanySettings().subscribe(res => {
      if (res.success && res.data) {
        this.settings.set(res.data);
        this.companyName = res.data.companyName;
        this.whatsAppNumber = res.data.whatsAppNumber;
        this.phoneContact = res.data.phoneContact;
        this.emailContact = res.data.emailContact;
        this.address = res.data.address;
      }
    });
  }

  saveSettings(): void {
    this.compService.updateCompanySettings({
      companyName: this.companyName,
      whatsAppNumber: this.whatsAppNumber,
      phoneContact: this.phoneContact,
      emailContact: this.emailContact,
      address: this.address
    }).subscribe({
      next: () => this.toast.success('Company settings updated.')
    });
  }
}
