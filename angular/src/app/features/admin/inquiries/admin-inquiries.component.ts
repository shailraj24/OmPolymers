import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequirementService } from '../../../core/services/requirement.service';
import { ToastService } from '../../../core/services/toast.service';
import { ClientRequirement, RequirementStatus } from '../../../core/models/requirement.model';

@Component({
  selector: 'app-admin-inquiries',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Client Inquiries & Leads CRM</h1>
          <p class="text-xs text-slate-400 mt-1">Review quotation requests and update lead progression status</p>
        </div>
      </div>

      <!-- Filter Controls -->
      <div class="flex flex-col sm:flex-row gap-3">
        <input 
          type="text" 
          [(ngModel)]="search" 
          (ngModelChange)="loadData()" 
          placeholder="Search by client name, email, phone, product..." 
          class="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
        />
        <select 
          [(ngModel)]="statusFilter" 
          (ngModelChange)="loadData()" 
          class="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
        >
          <option value="All">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <!-- Inquiries Table -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th class="p-3">Client</th>
              <th class="p-3">Contact Details</th>
              <th class="p-3">Product / Qty</th>
              <th class="p-3">Requirement Description</th>
              <th class="p-3">Status</th>
              <th class="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr *ngFor="let item of items()">
              <td class="p-3">
                <div class="font-bold text-white">{{ item.fullName }}</div>
                <div class="text-[11px] text-slate-400">{{ item.companyName || 'Independent' }}</div>
              </td>
              <td class="p-3">
                <div>{{ item.email }}</div>
                <div class="font-mono text-slate-400">{{ item.phoneNumber }}</div>
              </td>
              <td class="p-3">
                <div class="font-semibold">{{ item.productOfInterest }}</div>
                <div class="text-slate-400">{{ item.quantity }}</div>
              </td>
              <td class="p-3 max-w-xs truncate">{{ item.requirementDescription }}</td>
              <td class="p-3">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold"
                  [ngClass]="{
                    'bg-emerald-950 text-emerald-400 border border-emerald-800': item.status === 'Completed',
                    'bg-blue-950 text-blue-400 border border-blue-800': item.status === 'New',
                    'bg-amber-950 text-amber-400 border border-amber-800': item.status === 'Contacted' || item.status === 'In Progress',
                    'bg-rose-950 text-rose-400 border border-rose-800': item.status === 'Rejected'
                  }">
                  {{ item.status }}
                </span>
              </td>
              <td class="p-3 text-right">
                <button (click)="openStatusModal(item)" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors">
                  Update
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Status Updater Modal -->
      <div *ngIf="selectedItem()" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
          <button (click)="selectedItem.set(null)" class="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
          <h3 class="text-base font-bold text-white">Update Lead Status</h3>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1">Status</label>
              <select [(ngModel)]="newStatus" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white">
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1">Admin Remarks</label>
              <textarea [(ngModel)]="adminRemarks" rows="3" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" placeholder="Add engineering quotation notes..."></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button (click)="selectedItem.set(null)" class="px-3 py-1.5 text-xs text-slate-400">Cancel</button>
            <button (click)="saveStatus()" class="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg">Save Status</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminInquiriesComponent implements OnInit {
  private reqService = inject(RequirementService);
  private toast = inject(ToastService);

  items = signal<ClientRequirement[]>([]);
  search = '';
  statusFilter = 'All';

  selectedItem = signal<ClientRequirement | null>(null);
  newStatus: RequirementStatus = 'Contacted';
  adminRemarks = '';

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.reqService.getAdminRequirements(1, 50, this.statusFilter, this.search).subscribe(res => {
      if (res.success && res.data) this.items.set(res.data.items);
    });
  }

  openStatusModal(item: ClientRequirement): void {
    this.selectedItem.set(item);
    this.newStatus = item.status;
    this.adminRemarks = item.adminRemarks || '';
  }

  saveStatus(): void {
    const item = this.selectedItem();
    if (!item) return;

    this.reqService.updateStatus(item.requirementId, { status: this.newStatus, adminRemarks: this.adminRemarks }).subscribe({
      next: res => {
        this.toast.success('Lead status updated.');
        this.selectedItem.set(null);
        this.loadData();
      }
    });
  }
}
