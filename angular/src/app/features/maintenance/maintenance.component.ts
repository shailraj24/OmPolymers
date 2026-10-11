import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { CompanyService } from '../../core/services/company.service';
import { RequirementService } from '../../core/services/requirement.service';
import { ToastService } from '../../core/services/toast.service';
import { APP_CONSTANTS } from '../../core/constants/app.constant';
import { CompanySettings } from '../../core/models/company.model';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css']
})
export class MaintenanceComponent implements OnInit {
  themeService = inject(ThemeService);
  companyService = inject(CompanyService);
  requirementService = inject(RequirementService);
  toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  // Component Signals
  company = signal<CompanySettings | null>(null);
  isLoadingCompany = signal<boolean>(true);
  showQuoteModal = signal<boolean>(false);
  isSubmittingQuote = signal<boolean>(false);

  // Fallback defaults from original HTML
  phone = APP_CONSTANTS.DEFAULT_CONTACT.PHONE;
  phoneTel = APP_CONSTANTS.DEFAULT_CONTACT.PHONE_TEL;
  email = APP_CONSTANTS.DEFAULT_CONTACT.EMAIL;
  emailMailto = APP_CONSTANTS.DEFAULT_CONTACT.EMAIL_MAILTO;
  address = APP_CONSTANTS.DEFAULT_CONTACT.ADDRESS;
  mapsUrl = APP_CONSTANTS.DEFAULT_CONTACT.MAPS_URL;

  // Reactive Quote Form with validations matching backend rules
  quoteForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.maxLength(150)]],
    companyName: [''],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(20)]],
    productOfInterest: ['HDPE Pipes & Extrusion'],
    quantity: [''],
    requirementDescription: ['', [Validators.required, Validators.minLength(5)]],
    city: [''],
    state: ['']
  });

  ngOnInit(): void {
    this.fetchCompanyDetails();
  }

  fetchCompanyDetails(): void {
    this.isLoadingCompany.set(true);
    this.companyService.getCompanySettings().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.company.set(res.data);
          if (res.data.phoneContact) {
            this.phone = res.data.phoneContact;
            this.phoneTel = `tel:${res.data.phoneContact.replace(/\s+/g, '')}`;
          }
          if (res.data.emailContact) {
            this.email = res.data.emailContact;
            this.emailMailto = `mailto:${res.data.emailContact}`;
          }
          if (res.data.address) {
            this.address = res.data.address;
          }
        }
        this.isLoadingCompany.set(false);
      },
      error: () => {
        // Safe graceful fallback to default contact values
        this.isLoadingCompany.set(false);
      }
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  openQuoteModal(): void {
    this.showQuoteModal.set(true);
  }

  closeQuoteModal(): void {
    this.showQuoteModal.set(false);
  }

  submitQuote(): void {
    if (this.quoteForm.invalid) {
      this.quoteForm.markAllAsTouched();
      this.toastService.error('Please complete all required fields correctly before submitting.', 'Form Validation');
      return;
    }

    this.isSubmittingQuote.set(true);
    this.requirementService.submitRequirement(this.quoteForm.value).subscribe({
      next: (res) => {
        this.isSubmittingQuote.set(false);
        this.toastService.success(res.message || 'Technical inquiry sent! We will contact you shortly.', 'Inquiry Recorded');
        this.quoteForm.reset({
          productOfInterest: 'HDPE Pipes & Extrusion'
        });
        this.showQuoteModal.set(false);
      },
      error: () => {
        this.isSubmittingQuote.set(false);
      }
    });
  }
}
