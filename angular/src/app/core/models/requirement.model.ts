export interface RequirementCreateRequest {
  fullName: string;
  companyName?: string;
  email: string;
  phoneNumber: string;
  productOfInterest?: string;
  quantity?: string;
  requirementDescription: string;
  city?: string;
  state?: string;
}

export type RequirementStatus = 'New' | 'Contacted' | 'In Progress' | 'Completed' | 'Rejected';

export interface ClientRequirement {
  requirementId: number;
  fullName: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  productOfInterest: string;
  quantity: string;
  requirementDescription: string;
  city: string;
  state: string;
  status: RequirementStatus;
  adminRemarks: string;
  createdAt: string;
}

export interface UpdateRequirementStatusRequest {
  status: RequirementStatus;
  adminRemarks?: string;
}
