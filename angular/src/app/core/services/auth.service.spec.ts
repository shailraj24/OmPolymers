import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '@env/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.clear();
  });

  it('should initialize with unauthenticated state when storage is empty', () => {
    expect(service.token()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should authenticate user and store token upon successful login', () => {
    const mockCredentials = { email: 'admin@ompolymer.com', password: 'Admin@123' };
    const mockResponse = {
      success: true,
      message: 'Login successful',
      data: {
        token: 'mock-jwt-token-xyz',
        fullName: 'System Administrator',
        email: 'admin@ompolymer.com',
        role: 'SuperAdmin' as const,
        expiry: '2026-10-11T20:00:00Z'
      },
      errors: null
    };

    service.login(mockCredentials).subscribe(res => {
      expect(res.success).toBeTrue();
      expect(service.token()).toBe('mock-jwt-token-xyz');
      expect(service.isAuthenticated()).toBeTrue();
      expect(service.role()).toBe('SuperAdmin');
    });

    const req = httpTesting.expectOne(`${environment.apiUrl}${API_ENDPOINTS.AUTH.LOGIN}`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should clear token and signals on logout', () => {
    service.token.set('existing-token');
    service.adminName.set('Admin');
    service.role.set('Admin');
    service.logout();

    expect(service.token()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
  });
});
