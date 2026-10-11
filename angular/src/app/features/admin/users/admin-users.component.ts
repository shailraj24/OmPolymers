import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminUserService } from '../../../core/services/admin-user.service';
import { ToastService } from '../../../core/services/toast.service';
import { AdminUser, CreateAdminRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">System Administrators Management</h1>
          <p class="text-xs text-slate-400 mt-1">SuperAdmin exclusive panel: Add, deactivate, and manage roles</p>
        </div>
        <button (click)="showCreateModal.set(true)" class="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs">
          + Add Administrator
        </button>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th class="p-3">Administrator</th>
              <th class="p-3">Email</th>
              <th class="p-3">Role</th>
              <th class="p-3">Status</th>
              <th class="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr *ngFor="let u of users()">
              <td class="p-3 font-semibold text-white">{{ u.fullName }}</td>
              <td class="p-3 text-slate-400 font-mono">{{ u.email }}</td>
              <td class="p-3">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold"
                  [ngClass]="u.role === 'SuperAdmin' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-blue-950 text-blue-400 border border-blue-800'">
                  {{ u.role }}
                </span>
              </td>
              <td class="p-3">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold"
                  [ngClass]="u.isActive ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'">
                  {{ u.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="p-3 text-right space-x-2">
                <button (click)="toggleStatus(u.adminId)" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300">
                  Toggle Status
                </button>
                <button (click)="deleteUser(u.adminId)" class="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add Administrator Modal -->
      <div *ngIf="showCreateModal()" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
          <button (click)="showCreateModal.set(false)" class="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
          <h3 class="text-base font-bold text-white">Create New Administrator</h3>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
              <input type="text" [(ngModel)]="newFullName" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1">Email</label>
              <input type="email" [(ngModel)]="newEmail" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1">Password</label>
              <input type="password" [(ngModel)]="newPassword" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1">Role</label>
              <select [(ngModel)]="newRole" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white">
                <option value="Admin">Admin</option>
                <option value="SuperAdmin">SuperAdmin</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button (click)="showCreateModal.set(false)" class="px-3 py-1.5 text-xs text-slate-400">Cancel</button>
            <button (click)="createAdmin()" class="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg">Create</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminUsersComponent implements OnInit {
  private userService = inject(AdminUserService);
  private toast = inject(ToastService);

  users = signal<AdminUser[]>([]);
  showCreateModal = signal(false);

  newFullName = '';
  newEmail = '';
  newPassword = '';
  newRole: 'SuperAdmin' | 'Admin' = 'Admin';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers(1, 50).subscribe(res => {
      if (res.success && res.data) this.users.set(res.data.items);
    });
  }

  toggleStatus(id: number): void {
    this.userService.toggleUserStatus(id).subscribe({
      next: () => {
        this.toast.success('Admin status toggled.');
        this.loadUsers();
      }
    });
  }

  deleteUser(id: number): void {
    if (!confirm('Are you sure you want to delete this administrator?')) return;
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.toast.success('Administrator deleted.');
        this.loadUsers();
      }
    });
  }

  createAdmin(): void {
    if (!this.newFullName || !this.newEmail || !this.newPassword) {
      this.toast.error('All fields are mandatory.');
      return;
    }

    this.userService.createUser({
      fullName: this.newFullName,
      email: this.newEmail,
      password: this.newPassword,
      role: this.newRole
    }).subscribe({
      next: () => {
        this.toast.success('Administrator created.');
        this.showCreateModal.set(false);
        this.newFullName = '';
        this.newEmail = '';
        this.newPassword = '';
        this.loadUsers();
      }
    });
  }
}
