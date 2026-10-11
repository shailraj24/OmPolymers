import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RequirementService } from '../../core/services/requirement.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { ClientRequirement, RequirementStatus } from '../../core/models/requirement.model';

@Component({
  selector: 'app-inquiries-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div class="max-w-7xl mx-auto">
        <header class="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
          <div>
            <h1 class="text-xl font-bold">Admin Inquiries CRM</h1>
            <p class="text-xs text-slate-400">Manage client leads and technical quotation requests</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs text-slate-400">Logged in as {{ auth.adminName() }}</span>
            <button (click)="logout()" class="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 rounded-md">Logout</button>
            <a routerLink="/" class="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 rounded-md">View Site</a>
          </div>
        </header>

        <!-- Filter bar -->
        <div class="flex gap-4 mb-4">
          <input [(ngModel)]="search" (ngModelChange)="loadData()" placeholder="Search client name, email, phone..." class="px-3 py-2 bg-slate-900 border border-slate-800 rounded text-xs flex-1" />
          <select [(ngModel)]="statusFilter" (ngModelChange)="loadData()" class="px-3 py-2 bg-slate-900 border border-slate-800 rounded text-xs">
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <!-- Table -->
        <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th class="p-3">Client</th>
                <th class="p-3">Contact</th>
                <th class="p-3">Product & Quantity</th>
                <th class="p-3">Description</th>
                <th class="p-3">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              <tr *ngFor="let item of items()">
                <td class="p-3">
                  <div class="font-semibold text-slate-200">{{ item.fullName }}</div>
                  <div class="text-[11px] text-slate-400">{{ item.companyName || 'Independent' }}</div>
                </td>
                <td class="p-3">
                  <div>{{ item.email }}</div>
                  <div class="font-mono text-slate-400">{{ item.phoneNumber }}</div>
                </td>
                <td class="p-3">
                  <div>{{ item.productOfInterest }}</div>
                  <div class="text-slate-400">{{ item.quantity }}</div>
                </td>
                <td class="p-3 max-w-xs truncate">{{ item.requirementDescription }}</td>
                <td class="p-3">
                  <span class="px-2 py-1 rounded text-[10px] font-semibold"
                    [ngClass]="{
                      'bg-emerald-950 text-emerald-400 border border-emerald-800': item.status === 'Completed',
                      'bg-blue-950 text-blue-400 border border-blue-800': item.status === 'New',
                      'bg-amber-950 text-amber-400 border border-amber-800': item.status === 'Contacted' || item.status === 'In Progress'
                    }">
                    {{ item.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class InquiriesListComponent implements OnInit {
  auth = inject(AuthService);
  private reqService = inject(RequirementService);
  private toast = inject(ToastService);

  items = signal<ClientRequirement[]>([]);
  search = '';
  statusFilter = 'All';

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.reqService.getAdminRequirements(1, 50, this.statusFilter, this.search).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.items.set(res.data.items);
        }
      }
    });
  }

  logout(): void {
    this.auth.logout();
  }
}
