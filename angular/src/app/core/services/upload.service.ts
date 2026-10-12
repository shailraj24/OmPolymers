import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@env/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
import { APP_CONSTANTS } from '../constants/app.constant';
import { ApiResponse } from '../models/api-response.model';
import { ImageUploadResponse, UploadProgressEvent } from '../models/upload.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  readonly maxSizeBytes = 5 * 1024 * 1024; // 5 MB
  readonly allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
  readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = this.authService.getToken() || 
      (typeof localStorage !== 'undefined' 
        ? (localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.AUTH_TOKEN) || localStorage.getItem('om_token') || localStorage.getItem('token'))
        : null);
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  /**
   * Validates file size, extension, and empty file client-side before dispatching network request.
   * Returns error message string if invalid, or null if valid.
   */
  validateFile(file: File | null | undefined): string | null {
    if (!file || file.size === 0) {
      return 'Please choose a non-empty image file.';
    }

    if (file.size > this.maxSizeBytes) {
      return `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds the maximum allowed limit of 5 MB.`;
    }

    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!this.allowedExtensions.includes(extension)) {
      return `File extension '${extension}' is not supported. Allowed formats: ${this.allowedExtensions.join(', ')}.`;
    }

    if (file.type && !this.allowedMimeTypes.includes(file.type.toLowerCase())) {
      return `File type '${file.type}' is not permitted.`;
    }

    return null;
  }

  /**
   * Upload image file with progress reporting.
   */
  uploadWithProgress(file: File, category = 'products'): Observable<UploadProgressEvent> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('category', category);

    const url = `${environment.apiUrl}${API_ENDPOINTS.UPLOADS.IMAGE}`;
    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
      headers: this.getAuthHeaders()
    });

    return this.http.request<ApiResponse<ImageUploadResponse>>(req).pipe(
      map(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const total = event.total || file.size;
          const progress = Math.round((100 * event.loaded) / total);
          return { progress };
        } else if (event.type === HttpEventType.Response) {
          return {
            progress: 100,
            response: event.body?.data
          };
        }
        return { progress: 0 };
      })
    );
  }

  /**
   * Direct upload returning image metadata and relative URL.
   */
  uploadImage(file: File, category = 'products'): Observable<ApiResponse<ImageUploadResponse>> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('category', category);

    const url = `${environment.apiUrl}${API_ENDPOINTS.UPLOADS.IMAGE}`;
    return this.http.post<ApiResponse<ImageUploadResponse>>(url, formData, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Dedicated site logo upload.
   */
  uploadLogo(file: File): Observable<ApiResponse<ImageUploadResponse>> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('category', 'logos');

    const url = `${environment.apiUrl}${API_ENDPOINTS.COMPANY.UPLOAD_LOGO}`;
    return this.http.post<ApiResponse<ImageUploadResponse>>(url, formData, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Safe image deletion.
   */
  deleteImage(relativePath: string): Observable<ApiResponse<boolean>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.UPLOADS.IMAGE}`;
    return this.http.delete<ApiResponse<boolean>>(url, {
      headers: this.getAuthHeaders(),
      body: { path: relativePath }
    });
  }

  /**
   * Fetch list of all uploaded media files metadata.
   */
  getUploadedFiles(category?: string): Observable<ApiResponse<ImageUploadResponse[]>> {
    let url = `${environment.apiUrl}${API_ENDPOINTS.UPLOADS.LIST}`;
    if (category) {
      url += `?category=${encodeURIComponent(category)}`;
    }
    return this.http.get<ApiResponse<ImageUploadResponse[]>>(url, {
      headers: this.getAuthHeaders()
    });
  }
}

