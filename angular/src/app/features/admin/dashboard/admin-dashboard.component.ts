import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RequirementService } from '../../../core/services/requirement.service';
import { ProductService } from '../../../core/services/product.service';
import { BlogService } from '../../../core/services/blog.service';
import { AuthService } from '../../../core/services/auth.service';
import { ClientRequirement } from '../../../core/models/requirement.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-8">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">System Overview Dashboard</h1>
        <p class="text-xs text-slate-400 mt-1">OM Polymer administrative metrics, dynamic articles, and operational controls</p>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div class="text-xs font-semibold text-slate-400">Total Leads & RFQs</div>
          <div class="text-3xl font-extrabold text-blue-400">{{ totalInquiries() }}</div>
          <div class="text-[11px] text-slate-500">Customer requests in database</div>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div class="text-xs font-semibold text-slate-400">Catalog Products</div>
          <div class="text-3xl font-extrabold text-emerald-400">{{ totalProducts() }}</div>
          <div class="text-[11px] text-slate-500">Active HDPE lines & compounds</div>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div class="text-xs font-semibold text-slate-400">Technical Articles</div>
          <div class="text-3xl font-extrabold text-indigo-400">{{ totalBlogs() }}</div>
          <div class="text-[11px] text-slate-500">Published engineering papers</div>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div class="text-xs font-semibold text-slate-400">Current Role Claim</div>
          <div class="text-xl font-extrabold text-purple-400">{{ auth.role() }}</div>
          <div class="text-[11px] text-slate-500 truncate">{{ auth.adminName() }}</div>
        </div>
      </div>

      <!-- Fast Action Jump Links -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a routerLink="/admin/products" class="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 transition-colors flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center text-lg">📦</div>
          <div>
            <div class="text-xs font-bold text-white">Manage Products</div>
            <div class="text-[11px] text-slate-400">Add, edit or toggle specs</div>
          </div>
        </a>

        <a routerLink="/admin/blogs" class="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 transition-colors flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center text-lg">📝</div>
          <div>
            <div class="text-xs font-bold text-white">Publish Articles</div>
            <div class="text-[11px] text-slate-400">Draft, edit, or publish blogs</div>
          </div>
        </a>

        <a routerLink="/admin/logs" class="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 transition-colors flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center text-lg">📜</div>
          <div>
            <div class="text-xs font-bold text-white">System Logs</div>
            <div class="text-[11px] text-slate-400">Dynamic file-stream logs</div>
          </div>
        </a>
      </div>

      <!-- Recent Inquiries Table -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden space-y-4 p-5">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-bold uppercase tracking-wider text-slate-200">Recent Customer Inquiries</h2>
          <a routerLink="/admin/inquiries" class="text-xs text-blue-400 hover:underline">View All CRM Leads →</a>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th class="p-3">Client</th>
                <th class="p-3">Contact</th>
                <th class="p-3">Product</th>
                <th class="p-3">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              <tr *ngFor="let item of recentInquiries()">
                <td class="p-3">
                  <div class="font-semibold text-white">{{ item.fullName }}</div>
                  <div class="text-[11px] text-slate-400">{{ item.companyName || 'Independent' }}</div>
                </td>
                <td class="p-3">
                  <div>{{ item.email }}</div>
                  <div class="font-mono text-slate-400">{{ item.phoneNumber }}</div>
                </td>
                <td class="p-3">{{ item.productOfInterest }}</td>
                <td class="p-3">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold"
                    [ngClass]="{
                      'bg-emerald-950 text-emerald-400 border border-emerald-800': item.status === 'Completed',
                      'bg-blue-950 text-blue-400 border border-blue-800': item.status === 'New',
                      'bg-amber-950 text-amber-400 border border-amber-800': item.status === 'Contacted' || item.status === 'In Progress'
                    }">
                    {{ item.status }}
                  </span>
                </td>
              </tr>
              <tr *ngIf="recentInquiries().length === 0">
                <td colspan="4" class="p-6 text-center text-slate-500">
                  No inquiries recorded yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  auth = inject(AuthService);
  private reqService = inject(RequirementService);
  private prodService = inject(ProductService);
  private blogService = inject(BlogService);

  totalInquiries = signal(0);
  totalProducts = signal(0);
  totalBlogs = signal(0);
  recentInquiries = signal<ClientRequirement[]>([]);

  ngOnInit(): void {
    this.reqService.getAdminRequirements(1, 5).subscribe(res => {
      if (res.success && res.data) {
        this.totalInquiries.set(res.data.totalCount);
        this.recentInquiries.set(res.data.items);
      }
    });

    this.prodService.getProducts(1, 1).subscribe(res => {
      if (res.success && res.data) {
        this.totalProducts.set(res.data.totalCount);
      }
    });

    this.blogService.getPublishedBlogs(1, 1).subscribe(res => {
      if (res.success && res.data) {
        this.totalBlogs.set(res.data.totalCount);
      }
    });
  }
}
