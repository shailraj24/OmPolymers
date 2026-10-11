export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  fullName: string;
  email: string;
  role: 'SuperAdmin' | 'Admin';
  profileImageUrl?: string;
  expiry: string;
}

export interface AdminUser {
  adminId: number;
  email: string;
  fullName: string;
  role: 'SuperAdmin' | 'Admin';
  profileImageUrl?: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminRequest {
  fullName: string;
  email: string;
  password: string;
  role: 'SuperAdmin' | 'Admin';
  profileImageUrl?: string;
  isActive?: boolean;
}

export interface UpdateAdminRequest {
  fullName?: string;
  email?: string;
  role?: 'SuperAdmin' | 'Admin';
  profileImageUrl?: string;
  isActive?: boolean;
}
