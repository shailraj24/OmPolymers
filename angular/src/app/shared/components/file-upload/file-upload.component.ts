import { Component, Input, Output, EventEmitter, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService } from '../../../core/services/upload.service';
import { ImageUploadResponse } from '../../../core/models/upload.model';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-2 text-xs">
      <!-- Label & Optional Helper -->
      <div class="flex items-center justify-between">
        <label class="font-semibold text-slate-300">
          {{ label }}
        </label>
        <span class="text-[10px] text-slate-500">{{ helperText }}</span>
      </div>

      <!-- Preview or Dropzone -->
      <div 
        class="relative border-2 border-dashed rounded-2xl p-4 transition-all flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden"
        [ngClass]="{
          'border-blue-500 bg-blue-950/20': isDragging(),
          'border-slate-700 hover:border-slate-600 bg-slate-950/70': !isDragging() && !previewUrl(),
          'border-slate-800 bg-slate-950/90': !isDragging() && previewUrl()
        }"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        (click)="triggerFileInput()"
      >
        <!-- Hidden Native File Input -->
        <input 
          #fileInput 
          type="file" 
          class="hidden" 
          [accept]="acceptedFormats" 
          (change)="onFileSelected($event)"
        />

        <!-- Current / Staged Image Preview -->
        <div *ngIf="previewUrl()" class="w-full space-y-3">
          <div class="relative w-full h-40 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
            <img 
              [src]="previewUrl()" 
              alt="Image Preview" 
              class="w-full h-full object-cover"
              (error)="onImageError()"
            />
            
            <div class="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button 
                type="button" 
                (click)="triggerFileInput(); $event.stopPropagation()" 
                class="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] rounded-lg shadow"
              >
                Change File
              </button>
              <button 
                type="button" 
                (click)="removeImage($event)" 
                class="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-[11px] rounded-lg shadow"
              >
                Remove
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span class="truncate max-w-[200px] font-mono text-slate-300">
              {{ currentFileName() || previewUrl() }}
            </span>
            <span class="text-emerald-400 font-medium">✓ Uploaded & Active</span>
          </div>
        </div>

        <!-- Empty State Dropzone -->
        <div *ngIf="!previewUrl()" class="py-4 px-2 space-y-2">
          <div class="w-10 h-10 mx-auto rounded-full bg-slate-800/80 flex items-center justify-center text-blue-400 text-lg shadow-inner">
            📁
          </div>
          <div>
            <div class="text-slate-200 font-semibold">Click to browse or drag & drop</div>
            <div class="text-[10px] text-slate-500 mt-0.5">JPEG, PNG, WEBP, or SVG (Max 5MB)</div>
          </div>
        </div>

        <!-- Real-time Progress Bar Overlay -->
        <div *ngIf="uploading()" class="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 space-y-2 z-10">
          <div class="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div class="text-xs font-semibold text-slate-200">Uploading to server... {{ uploadProgress() }}%</div>
          <div class="w-full max-w-xs bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div class="bg-blue-500 h-full transition-all duration-200" [style.width.%]="uploadProgress()"></div>
          </div>
        </div>
      </div>

      <!-- Validation Error Notification -->
      <div *ngIf="errorMessage()" class="p-2.5 bg-rose-950/60 border border-rose-800 rounded-xl text-[11px] text-rose-300 flex items-center justify-between">
        <div class="flex items-center gap-1.5">
          <span>⚠️</span>
          <span>{{ errorMessage() }}</span>
        </div>
        <button type="button" (click)="errorMessage.set(null)" class="text-rose-400 hover:text-white ml-2">✕</button>
      </div>
    </div>
  `
})
export class FileUploadComponent {
  private uploadService = inject(UploadService);

  @Input() category = 'products';
  @Input() label = 'Main Image';
  @Input() helperText = 'Recommended 800x600 · Max 5MB';
  @Input() acceptedFormats = '.jpg,.jpeg,.png,.webp,.svg,image/jpeg,image/png,image/webp,image/svg+xml';

  @Input() set currentImageUrl(val: string | null | undefined) {
    if (val) {
      this.previewUrl.set(val);
      this.currentFileName.set(val.split('/').pop() || null);
    } else {
      this.previewUrl.set(null);
      this.currentFileName.set(null);
    }
  }

  @Output() imageUrlChange = new EventEmitter<string>();
  @Output() fileUploaded = new EventEmitter<ImageUploadResponse>();
  @Output() imageRemoved = new EventEmitter<void>();

  @ViewChild('fileInput') fileInputRef?: ElementRef<HTMLInputElement>;

  previewUrl = signal<string | null>(null);
  currentFileName = signal<string | null>(null);
  isDragging = signal<boolean>(false);
  uploading = signal<boolean>(false);
  uploadProgress = signal<number>(0);
  errorMessage = signal<string | null>(null);

  triggerFileInput(): void {
    this.fileInputRef?.nativeElement.click();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File): void {
    this.errorMessage.set(null);

    // Client-side validation check
    const validation = this.uploadService.validateFile(file);
    if (validation) {
      this.errorMessage.set(validation);
      return;
    }

    // Set immediate client thumbnail preview
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.previewUrl.set(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    this.currentFileName.set(file.name);
    this.uploading.set(true);
    this.uploadProgress.set(10);

    // Dispatch upload to ASP.NET Core API
    this.uploadService.uploadWithProgress(file, this.category).subscribe({
      next: (event) => {
        if (event.progress !== undefined) {
          this.uploadProgress.set(event.progress);
        }
        if (event.response) {
          this.uploading.set(false);
          this.previewUrl.set(event.response.relativeUrl);
          this.imageUrlChange.emit(event.response.relativeUrl);
          this.fileUploaded.emit(event.response);
        }
      },
      error: (err) => {
        this.uploading.set(false);
        const errorMsg = err?.error?.message || err?.message || 'File upload failed. Please verify server connection.';
        this.errorMessage.set(errorMsg);
      }
    });
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    const oldUrl = this.previewUrl();
    this.previewUrl.set(null);
    this.currentFileName.set(null);
    this.errorMessage.set(null);
    this.imageUrlChange.emit('');
    this.imageRemoved.emit();

    if (oldUrl && oldUrl.startsWith('/uploads/')) {
      this.uploadService.deleteImage(oldUrl).subscribe();
    }
  }

  onImageError(): void {
    // Graceful fallback if image is missing
  }
}
