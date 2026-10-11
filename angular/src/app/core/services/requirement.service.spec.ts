import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { RequirementService } from './requirement.service';
import { environment } from '@env/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';

describe('RequirementService', () => {
  let service: RequirementService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RequirementService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(RequirementService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should submit client requirement to /api/requirements', () => {
    const payload = {
      fullName: 'Ramesh Patel',
      email: 'ramesh@patelpoly.com',
      phoneNumber: '+919876543210',
      requirementDescription: 'Need quotation for 2,000 meters HDPE pipes PN16'
    };

    const mockResponse = {
      success: true,
      message: 'Your technical requirement and quotation request has been recorded.',
      data: true,
      errors: null
    };

    service.submitRequirement(payload).subscribe(res => {
      expect(res.success).toBeTrue();
      expect(res.data).toBeTrue();
    });

    const req = httpTesting.expectOne(`${environment.apiUrl}${API_ENDPOINTS.REQUIREMENTS.SUBMIT}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });
});
