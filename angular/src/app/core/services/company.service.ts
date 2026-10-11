import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
import { ApiResponse } from '../models/api-response.model';
import { CompanySettings, WhatsAppUrlResponse } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private http = inject(HttpClient);

  getCompanySettings(): Observable<ApiResponse<CompanySettings>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.COMPANY.GET_INFO}`;
    return this.http.get<ApiResponse<CompanySettings>>(url);
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
    return this.http.put<ApiResponse<boolean>>(url, settings);
  }
}
