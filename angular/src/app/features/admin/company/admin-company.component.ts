import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyService } from '../../../core/services/company.service';
import { ToastService } from '../../../core/services/toast.service';
import { UploadService } from '../../../core/services/upload.service';
import { CompanySettings } from '../../../core/models/company.model';
import { FileUploadComponent } from '../../../shared/components/file-upload/file-upload.component';
import { FileUrlPipe } from '../../../shared/pipes/file-url.pipe';

@Component({
  selector: 'app-admin-company',
  standalone: true,
  imports: [CommonModule, FormsModule, FileUploadComponent, FileUrlPipe],
  template: `
    <div class="space-y-6 max-w-4xl">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Company Profile & Dynamic Brand Settings</h1>
        <p class="text-xs text-slate-400 mt-1">
          Manage corporate identity, dynamic site logo, contact endpoints, and direct WhatsApp customer desk
        </p>
      </div>

      <!-- 1. Dynamic Site Logo Management Card -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              <span>🖼️</span> Dynamic Site Logo
            </h2>
            <p class="text-xs text-slate-400 mt-0.5">
              Select or replace the company logo. Changes are uploaded to <code class="text-blue-400 font-mono">/uploads/logos/</code> and updated across public and admin interfaces when you click Save Settings.
            </p>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800">
            Brand Asset
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
          <!-- Active Logo Preview Card -->
          <div class="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-3">
            <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Logo Preview</div>
            <div class="w-32 h-20 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center p-2 shadow-inner overflow-hidden">
              <img 
                *ngIf="previewLogoUrl()" 
                [src]="previewLogoUrl() | fileUrl" 
                alt="Current Logo" 
                class="max-w-full max-h-full object-contain" 
                (error)="onLogoError()" 
              />
              <div *ngIf="!previewLogoUrl()" class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm">
                OM
              </div>
            </div>
            <div class="text-[10px] font-mono text-slate-400 break-all max-w-full">
              {{ stagedLogoFile ? ('Staged: ' + stagedLogoFile.name) : (logoUrl || 'Default logo') }}
            </div>
            <span *ngIf="stagedLogoFile" class="text-[10px] text-amber-400 font-semibold">
              ⏳ Ready to upload on Save
            </span>
          </div>

          <!-- File Upload Dropzone for Logo -->
          <div>
            <app-file-upload 
              category="logos" 
              label="Select / Replace Site Logo" 
              helperText="PNG, SVG, WEBP, JPG (Max 5MB) · Uploads on Save"
              [currentImageUrl]="logoUrl"
              (fileSelected)="onLogoFileSelected($event)"
              (imageRemoved)="onLogoRemoved()"
            ></app-file-upload>
          </div>
        </div>
      </div>

      <!-- 2. Profile & WhatsApp Desk Information Card -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-sm" *ngIf="settings()">
        <h2 class="text-base font-bold text-white flex items-center gap-2">
          <span>🏢</span> Corporate Information & Contact
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Company Legal Name *</label>
            <input 
              type="text" 
              [(ngModel)]="companyName" 
              class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500" 
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Direct WhatsApp Number (with Country Code) *</label>
            <input 
              type="text" 
              [(ngModel)]="whatsAppNumber" 
              placeholder="+919876543210"
              class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-blue-500" 
            />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Telephone Contact</label>
            <input 
              type="text" 
              [(ngModel)]="phoneContact" 
              class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-blue-500" 
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-1">Official Inquiry Email</label>
            <input 
              type="email" 
              [(ngModel)]="emailContact" 
              class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500" 
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Factory & Headquarters Address</label>
          <input 
            type="text" 
            [(ngModel)]="address" 
            class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500" 
          />
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-slate-800">
          <span class="text-[11px] text-slate-400">
            Changes persist directly to SQL Server <code class="text-blue-400 font-mono">CompanySettings</code>
          </span>
          <button 
            (click)="saveSettings()" 
            [disabled]="saving"
            class="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-colors shadow-md disabled:opacity-50 flex items-center gap-2"
          >
            <span>💾</span>
            <span>{{ saving ? 'Saving & Uploading...' : 'Save Settings' }}</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class AdminCompanyComponent implements OnInit {
  private compService = inject(CompanyService);
  private toast = inject(ToastService);
  private uploadService = inject(UploadService);

  settings = signal<CompanySettings | null>(null);

  companyName = '';
  whatsAppNumber = '';
  phoneContact = '';
  emailContact = '';
  address = '';
  logoUrl = '';
  previewLogoUrl = signal<string>('/uploads/logos/om-polymer-logo.png');
  stagedLogoFile: File | null = null;
  saving = false;

  ngOnInit(): void {
    this.compService.getCompanySettings().subscribe(res => {
      if (res.success && res.data) {
        this.settings.set(res.data);
        this.companyName = res.data.companyName;
        this.whatsAppNumber = res.data.whatsAppNumber;
        this.phoneContact = res.data.phoneContact;
        this.emailContact = res.data.emailContact;
        this.address = res.data.address;
        this.logoUrl = res.data.logoUrl || '/uploads/logos/om-polymer-logo.png';
        this.previewLogoUrl.set(this.logoUrl);
      }
    });
  }

  onLogoFileSelected(file: File | null): void {
    this.stagedLogoFile = file;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.previewLogoUrl.set(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else {
      this.previewLogoUrl.set(this.logoUrl);
    }
  }

  onLogoRemoved(): void {
    this.stagedLogoFile = null;
    this.logoUrl = '';
    this.previewLogoUrl.set('');
  }

  onLogoError(): void {
    // Fallback if image fails to load
  }

  saveSettings(): void {
    this.saving = true;

    // Only upload to API when clicking Save Settings
    if (this.stagedLogoFile) {
      this.compService.uploadLogo(this.stagedLogoFile).subscribe({
        next: (uploadRes) => {
          if (uploadRes.success && uploadRes.data?.relativeUrl) {
            this.logoUrl = uploadRes.data.relativeUrl;
            this.previewLogoUrl.set(this.logoUrl);
            this.stagedLogoFile = null;
            this.executeSaveSettings();
          } else {
            this.saving = false;
            this.toast.error(uploadRes.message || 'Logo upload failed.');
          }
        },
        error: (err) => {
          this.saving = false;
          this.toast.error(err?.error?.message || 'Logo upload failed. Please verify credentials.');
        }
      });
    } else {
      this.executeSaveSettings();
    }
  }

  private executeSaveSettings(): void {
    this.compService.updateCompanySettings({
      companyName: this.companyName,
      logoUrl: this.logoUrl,
      whatsAppNumber: this.whatsAppNumber,
      phoneContact: this.phoneContact,
      emailContact: this.emailContact,
      address: this.address
    }).subscribe({
      next: () => {
        this.saving = false;
        this.toast.success('Company profile and settings saved successfully.');
      },
      error: () => {
        this.saving = false;
        this.toast.error('Failed to update company settings.');
      }
    });
  }
}
