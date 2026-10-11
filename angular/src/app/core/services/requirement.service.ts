import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
import { ApiResponse, PagedResponse } from '../models/api-response.model';
import { 
  RequirementCreateRequest, 
  ClientRequirement, 
  UpdateRequirementStatusRequest 
} from '../models/requirement.model';

@Injectable({
  providedIn: 'root'
})
export class RequirementService {
  private http = inject(HttpClient);

  // Public client submission (Rate limited to 2 req/min)
  submitRequirement(req: RequirementCreateRequest): Observable<ApiResponse<boolean>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.REQUIREMENTS.SUBMIT}`;
    return this.http.post<ApiResponse<boolean>>(url, req);
  }

  // Admin inquiries CRM
  getAdminRequirements(page = 1, pageSize = 10, status = 'All', search = ''): Observable<ApiResponse<PagedResponse<ClientRequirement>>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.REQUIREMENTS.GET_ALL}`;
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (status && status !== 'All') params = params.set('status', status);
    if (search.trim()) params = params.set('search', search.trim());

    return this.http.get<ApiResponse<PagedResponse<ClientRequirement>>>(url, { params });
  }

  updateStatus(id: number, payload: UpdateRequirementStatusRequest): Observable<ApiResponse<ClientRequirement>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.REQUIREMENTS.UPDATE_STATUS(id)}`;
    return this.http.patch<ApiResponse<ClientRequirement>>(url, payload);
  }
}
