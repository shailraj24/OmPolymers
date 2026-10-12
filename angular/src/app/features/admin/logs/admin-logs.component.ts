import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogService } from '../../../core/services/log.service';
import { ToastService } from '../../../core/services/toast.service';
import { LogEntry } from '../../../core/models/log.model';

@Component({
  selector: 'app-admin-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">System & Application Logs</h1>
          <p class="text-xs text-slate-400 mt-1">Live structured log stream loaded dynamically from the host /logs filesystem</p>
        </div>
        <div class="flex items-center gap-2">
          <button 
            (click)="loadLogs()" 
            class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <span>🔄</span> Refresh Stream
          </button>
          <button 
            (click)="confirmClearLogs()" 
            class="px-3.5 py-2 bg-rose-950 hover:bg-rose-900 text-rose-300 text-xs font-semibold rounded-xl border border-rose-800 transition-colors flex items-center gap-1.5"
          >
            <span>🗑️</span> Rotate / Clear
          </button>
        </div>
      </div>

      <!-- Filters Bar -->
      <div class="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900 p-3.5 rounded-2xl border border-slate-800">
        <div class="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <!-- Severity Filter -->
          <select 
            [(ngModel)]="selectedSeverity" 
            (ngModelChange)="loadLogs()"
            class="px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Severities</option>
            <option value="INFO">INFO Only</option>
            <option value="WARN">WARN Only</option>
            <option value="ERROR">ERROR Only</option>
            <option value="DEBUG">DEBUG Only</option>
          </select>

          <!-- File Filter -->
          <select 
            [(ngModel)]="selectedFile" 
            (ngModelChange)="loadLogs()"
            class="px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
          >
            <option value="ALL">All Log Files</option>
            <option *ngFor="let f of logFiles()" [value]="f">{{ f }}</option>
          </select>

          <!-- Keyword Search -->
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (ngModelChange)="loadLogs()" 
            placeholder="Search log messages, paths, errors..." 
            class="w-full sm:w-64 px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div class="text-xs text-slate-400">
          Showing <span class="font-bold text-white">{{ logs().length }}</span> events
        </div>
      </div>

      <!-- Logs Terminal View -->
      <div class="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl font-mono text-xs">
        <div class="bg-slate-900/80 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Disk-backed Logs Stream</span>
          </div>
          <span>Active Files: {{ logFiles().length }}</span>
        </div>

        <div *ngIf="loading()" class="p-16 text-center text-slate-500">
          Streaming logs from filesystem...
        </div>

        <div *ngIf="!loading() && logs().length === 0" class="p-16 text-center text-slate-500">
          No logs found matching filter criteria.
        </div>

        <div *ngIf="!loading() && logs().length > 0" class="divide-y divide-slate-900 max-h-[600px] overflow-y-auto p-2">
          <div *ngFor="let log of logs()" class="p-3 hover:bg-slate-900/40 transition-colors rounded-lg flex flex-col gap-1.5">
            <div class="flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div class="flex items-center gap-2">
                <!-- Severity badge -->
                <span class="px-2 py-0.5 rounded text-[10px] font-bold"
                  [ngClass]="{
                    'bg-emerald-950 text-emerald-400 border border-emerald-800/60': log.level === 'INFO',
                    'bg-amber-950 text-amber-400 border border-amber-800/60': log.level === 'WARN',
                    'bg-rose-950 text-rose-400 border border-rose-800/60': log.level === 'ERROR',
                    'bg-slate-800 text-slate-400 border border-slate-700': log.level === 'DEBUG'
                  }">
                  {{ log.level }}
                </span>

                <span class="text-slate-400">[{{ log.category || 'SYSTEM' }}]</span>
                <span *ngIf="log.sourceFile" class="text-slate-600 truncate max-w-xs">{{ log.sourceFile }}</span>
              </div>
              <span class="text-slate-500">{{ log.timestamp }}</span>
            </div>

            <!-- Message -->
            <div class="text-slate-200 whitespace-pre-wrap leading-relaxed text-xs">
              {{ log.message }}
            </div>

            <!-- Details JSON if any -->
            <div *ngIf="log.details" class="mt-1 p-2 bg-slate-900/80 rounded border border-slate-800/60 text-[11px] text-slate-400 whitespace-pre-wrap overflow-x-auto">
              {{ log.details | json }}
            </div>
          </div>
        </div>
      </div>

      <!-- Clear Confirmation Modal -->
      <div *ngIf="showClearModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div class="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
          <h3 class="text-base font-bold text-rose-400 flex items-center gap-2">
            <span>⚠️</span> Rotate / Clear Log Files
          </h3>
          <p class="text-xs text-slate-300">
            Are you sure you want to clear current logs? A fresh log rotation cycle will be initialized on disk.
          </p>
          <div class="flex justify-end gap-3 pt-3">
            <button (click)="showClearModal = false" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs">
              Cancel
            </button>
            <button (click)="executeClear()" class="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-md">
              Confirm Rotate
            </button>
          </div>
        </div>
      </div>

    </div>
  `
})
export class AdminLogsComponent implements OnInit {
  private logService = inject(LogService);
  private toast = inject(ToastService);

  logs = signal<LogEntry[]>([]);
  logFiles = signal<string[]>([]);
  loading = signal(true);

  selectedSeverity = 'ALL';
  selectedFile = 'ALL';
  searchQuery = '';
  showClearModal = false;

  ngOnInit(): void {
    this.loadFiles();
    this.loadLogs();
  }

  loadFiles(): void {
    this.logService.getLogFiles().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.logFiles.set(res.data);
        }
      }
    });
  }

  loadLogs(): void {
    this.loading.set(true);
    this.logService.getLogs(this.selectedSeverity, this.selectedFile, this.searchQuery).subscribe({
      next: res => {
        if (res.success && res.data?.logs) {
          this.logs.set(res.data.logs);
        } else {
          this.logs.set([]);
        }
        this.loading.set(false);
      },
      error: () => {
        this.logs.set([]);
        this.loading.set(false);
      }
    });
  }

  confirmClearLogs(): void {
    this.showClearModal = true;
  }

  executeClear(): void {
    const fileToClear = this.selectedFile !== 'ALL' ? this.selectedFile : undefined;
    this.logService.clearLogs(fileToClear).subscribe({
      next: res => {
        if (res.success) {
          this.toast.success('Logs rotated/cleared successfully.');
          this.showClearModal = false;
          this.loadLogs();
        } else {
          this.toast.error('Failed to clear logs.');
        }
      },
      error: () => this.toast.error('Server error clearing logs.')
    });
  }
}
