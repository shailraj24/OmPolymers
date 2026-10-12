export interface CompanySettings {
  settingId: number;
  companyName: string;
  description: string;
  yearsOfExperience: number;
  aboutContent: string;
  address: string;
  emailContact: string;
  phoneContact: string;
  whatsAppNumber: string;
  socialFacebook: string;
  socialLinkedIn: string;
  socialInstagram: string;
  updatedAt: string;
  whatsAppUrl?: string;
   whatsappContact?: string;
}

export interface WhatsAppUrlResponse {
  phoneNumber: string;
  rawNumber: string;
  message: string;
  url: string;
}
