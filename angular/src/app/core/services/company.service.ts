import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '@env/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
import { ApiResponse } from '../models/api-response.model';
import { CompanySettings, WhatsAppUrlResponse } from '../models/company.model';
import { ImageUploadResponse } from '../models/upload.model';
import { FileUrlService } from './file-url.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private http = inject(HttpClient);
  private fileUrlService = inject(FileUrlService);

  // Reactive signals for globally synchronized site logo and company branding
  readonly currentLogo = signal<string>('/uploads/logos/om-polymer-logo.png');
  readonly fullLogoUrl = computed(() => this.fileUrlService.resolve(this.currentLogo()));
  readonly companyProfile = signal<CompanySettings | null>(null);

  getCompanySettings(): Observable<ApiResponse<CompanySettings>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.COMPANY.GET_INFO}`;
    return this.http.get<ApiResponse<CompanySettings>>(url).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.companyProfile.set(res.data);
          if (res.data.logoUrl) {
            this.currentLogo.set(res.data.logoUrl);
          }
        }
      })
    );
  }

  getWhatsAppUrl(productSlug?: string, customMessage?: string): Observable<WhatsAppUrlResponse> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.COMPANY.GET_WHATSAPP_URL}`;
    let params = new HttpParams();
    if (productSlug) params = params.set('productSlug', productSlug);
    if (customMessage) params = params.set('message', customMessage);

    return this.http.get<WhatsAppUrlResponse>(url, { params });
  }

  updateCompanySettings(settings: Partial<CompanySettings>): Observable<ApiResponse<boolean>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.COMPANY.UPDATE}`;
    return this.http.put<ApiResponse<boolean>>(url, settings).pipe(
      tap(res => {
        if (res.success && settings.logoUrl) {
          this.currentLogo.set(settings.logoUrl);
        }
      })
    );
  }

  /**
   * Dedicated logo upload that persists to uploads/logos/ and updates CompanySettings.LogoUrl
   */
  uploadLogo(file: File): Observable<ApiResponse<ImageUploadResponse>> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('category', 'logos');

    const url = `${environment.apiUrl}${API_ENDPOINTS.COMPANY.UPLOAD_LOGO}`;
    return this.http.post<ApiResponse<ImageUploadResponse>>(url, formData).pipe(
      tap(res => {
        if (res.success && res.data?.relativeUrl) {
          this.currentLogo.set(res.data.relativeUrl);
        }
      })
    );
  }
}
