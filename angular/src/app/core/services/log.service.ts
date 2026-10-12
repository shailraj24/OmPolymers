import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
import { ApiResponse } from '../models/api-response.model';
import { LogsResponse } from '../models/log.model';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private http = inject(HttpClient);

  getLogs(severity?: string, file?: string, search?: string): Observable<ApiResponse<LogsResponse>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.LOGS.LIST}`;
    let params = new HttpParams();

    if (severity && severity !== 'ALL') params = params.set('severity', severity);
    if (file && file !== 'ALL') params = params.set('file', file);
    if (search?.trim()) params = params.set('search', search.trim());

    return this.http.get<ApiResponse<LogsResponse>>(url, { params });
  }

  getLogFiles(): Observable<ApiResponse<string[]>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.LOGS.FILES}`;
    return this.http.get<ApiResponse<string[]>>(url);
  }

  clearLogs(fileName?: string): Observable<ApiResponse<{ cleared: boolean }>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.LOGS.CLEAR}`;
    return this.http.post<ApiResponse<{ cleared: boolean }>>(url, { fileName });
  }
}
