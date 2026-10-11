import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { environment } from '@env/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
import { APP_CONSTANTS } from '../constants/app.constant';
import { ApiResponse } from '../models/api-response.model';
import { LoginRequest, LoginResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  token = signal<string | null>(this.getStoredToken());
  adminName = signal<string | null>(this.getStoredName());
  role = signal<'SuperAdmin' | 'Admin' | null>(this.getStoredRole());
  currentUser = signal<LoginResponse | null>(null);

  isAuthenticated = computed(() => !!this.token());
  isSuperAdmin = computed(() => this.role() === 'SuperAdmin');

  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.AUTH.LOGIN}`;
    return this.http.post<ApiResponse<LoginResponse>>(url, credentials).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.setSession(res.data);
        }
      })
    );
  }

  logout(): void {
    this.token.set(null);
    this.adminName.set(null);
    this.role.set(null);
    this.currentUser.set(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.ADMIN_NAME);
      localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.ADMIN_ROLE);
    }
  }

  getToken(): string | null {
    return this.token();
  }

  verifySession(): Observable<boolean> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.AUTH.VERIFY}`;
    return this.http.get<ApiResponse<any>>(url).pipe(
      map(res => res.success),
      tap({
        error: () => this.logout()
      })
    );
  }

  private setSession(authData: LoginResponse): void {
    this.token.set(authData.token);
    this.adminName.set(authData.fullName);
    this.role.set(authData.role);
    this.currentUser.set(authData);

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.AUTH_TOKEN, authData.token);
      localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.ADMIN_NAME, authData.fullName);
      localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.ADMIN_ROLE, authData.role);
    }
  }

  private getStoredToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.AUTH_TOKEN);
    }
    return null;
  }

  private getStoredName(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.ADMIN_NAME);
    }
    return null;
  }

  private getStoredRole(): 'SuperAdmin' | 'Admin' | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.ADMIN_ROLE) as 'SuperAdmin' | 'Admin' | null;
    }
    return null;
  }
}
