// Registry of Complete Angular 19 Standalone Source Code Files
// Complete role-based enterprise application: Admin Panel + User Client Portal

export interface AngularCodeFile {
  path: string;
  name: string;
  category: 'Configuration' | 'Core & Services' | 'Interceptors & Guards' | 'Models & DTOs' | 'Layouts' | 'User Portal' | 'Admin Panel' | 'Auth' | 'Shared & Shell' | 'Unit Tests' | 'Documentation';
  language: 'typescript' | 'html' | 'css' | 'json' | 'markdown';
  description: string;
  content: string;
}

export const angularSolutionFiles: AngularCodeFile[] = [
  // ==========================================
  // 1. CONFIGURATION
  // ==========================================
  {
    path: 'package.json',
    name: 'package.json',
    category: 'Configuration',
    language: 'json',
    description: 'Angular 19 project dependencies and npm scripts',
    content: `{
  "name": "om-polymer-angular",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "ng": "ng",
    "start": "ng serve --port 4200",
    "build": "ng build --configuration production",
    "watch": "ng build --watch --configuration development",
    "test": "ng test --watch=false --browsers=ChromeHeadless",
    "lint": "ng lint"
  },
  "dependencies": {
    "@angular/animations": "^19.1.0",
    "@angular/common": "^19.1.0",
    "@angular/compiler": "^19.1.0",
    "@angular/core": "^19.1.0",
    "@angular/forms": "^19.1.0",
    "@angular/platform-browser": "^19.1.0",
    "@angular/platform-browser-dynamic": "^19.1.0",
    "@angular/router": "^19.1.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.15.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^19.1.0",
    "@angular/cli": "^19.1.0",
    "@angular/compiler-cli": "^19.1.0",
    "@types/jasmine": "~5.1.0",
    "autoprefixer": "^10.4.20",
    "jasmine-core": "~5.1.0",
    "karma": "~6.4.0",
    "karma-chrome-launcher": "~3.2.0",
    "karma-coverage": "~2.2.0",
    "karma-jasmine": "~5.1.0",
    "karma-jasmine-html-reporter": "~2.1.0",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "~5.6.2"
  }
}
`
  },
  {
    path: 'angular.json',
    name: 'angular.json',
    category: 'Configuration',
    language: 'json',
    description: 'Angular CLI workspace and build configuration',
    content: `{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "om-polymer-angular": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:component": {
          "style": "css",
          "standalone": true,
          "skipTests": false
        }
      },
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/om-polymer-angular",
            "index": "src/index.html",
            "browser": "src/main.ts",
            "polyfills": ["zone.js"],
            "tsConfig": "tsconfig.app.json",
            "assets": [
              {
                "glob": "**/*",
                "input": "public"
              }
            ],
            "styles": ["src/styles.css"],
            "scripts": []
          },
          "configurations": {
            "production": {
              "budgets": [
                { "type": "initial", "maximumWarning": "500kB", "maximumError": "1MB" },
                { "type": "anyComponentStyle", "maximumWarning": "4kB", "maximumError": "8kB" }
              ],
              "outputHashing": "all",
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.production.ts"
                }
              ]
            },
            "development": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "buildTarget": "om-polymer-angular:build:production"
            },
            "development": {
              "buildTarget": "om-polymer-angular:build:development",
              "proxyConfig": "proxy.conf.json"
            }
          },
          "defaultConfiguration": "development"
        },
        "test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "polyfills": ["zone.js", "zone.js/testing"],
            "tsConfig": "tsconfig.spec.json",
            "assets": [{ "glob": "**/*", "input": "public" }],
            "styles": ["src/styles.css"],
            "scripts": []
          }
        }
      }
    }
  }
}
`
  },
  {
    path: 'proxy.conf.json',
    name: 'proxy.conf.json',
    category: 'Configuration',
    language: 'json',
    description: 'Angular development proxy configuration routing /api to ASP.NET Core server',
    content: `{
  "/api": {
    "target": "http://localhost:5000",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
`
  },
  {
    path: 'tailwind.config.js',
    name: 'tailwind.config.js',
    category: 'Configuration',
    language: 'typescript',
    description: 'Tailwind CSS design tokens, colors, and keyframe animations',
    content: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        }
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'system-ui', '-apple-system', 'Arial', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        rotateGear: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        loadingBar: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(230%)' },
        }
      },
      animation: {
        'float-slow': 'float 7s ease-in-out infinite',
        'float-reverse': 'float 8s ease-in-out infinite reverse',
        'gear-spin': 'rotateGear 5s linear infinite',
        'progress-bar': 'loadingBar 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
`
  },
  {
    path: 'tsconfig.json',
    name: 'tsconfig.json',
    category: 'Configuration',
    language: 'json',
    description: 'TypeScript compiler configuration with path aliases',
    content: `{
  "compileOnSave": false,
  "compilerOptions": {
    "outDir": "./dist/out-tsc",
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "moduleResolution": "bundler",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "paths": {
      "@core/*": ["src/app/core/*"],
      "@shared/*": ["src/app/shared/*"],
      "@features/*": ["src/app/features/*"],
      "@layouts/*": ["src/app/layouts/*"],
      "@env/*": ["src/environments/*"]
    }
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}
`
  },
  {
    path: 'src/environments/environment.ts',
    name: 'environment.ts',
    category: 'Configuration',
    language: 'typescript',
    description: 'Development environment configuration',
    content: `export const environment = {
  production: false,
  apiUrl: '/api',
  companyName: 'OM POLYMER',
  apiVersion: '1.0.0',
  defaultPageSize: 10
};
`
  },
  {
    path: 'src/environments/environment.production.ts',
    name: 'environment.production.ts',
    category: 'Configuration',
    language: 'typescript',
    description: 'Production environment configuration',
    content: `export const environment = {
  production: true,
  apiUrl: '/api',
  companyName: 'OM POLYMER',
  apiVersion: '1.0.0',
  defaultPageSize: 10
};
`
  },
  {
    path: 'src/styles.css',
    name: 'styles.css',
    category: 'Configuration',
    language: 'css',
    description: 'Global stylesheet with Tailwind CSS base layers and custom keyframes',
    content: `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply antialiased transition-colors duration-300;
    font-family: "Segoe UI", Arial, sans-serif;
  }
}

@keyframes floatAnim {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes rotateGear {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes loadingBar {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(230%); }
}

.anim-gear {
  animation: rotateGear 5s linear infinite;
}

.anim-loading-bar::before {
  content: "";
  display: block;
  height: 100%;
  width: 45%;
  background: #2563eb;
  border-radius: 10px;
  animation: loadingBar 2s ease-in-out infinite;
}
`
  },
  {
    path: 'src/index.html',
    name: 'index.html',
    category: 'Configuration',
    language: 'html',
    description: 'HTML5 entry document with viewport and fonts',
    content: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>OM POLYMER | Industrial Extrusion & Web API Platform</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="OM Polymer - ISO 9001 certified manufacturer of HDPE pipes, polymer compounds, and technical extrusion solutions.">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
</head>
<body class="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
  <app-root></app-root>
</body>
</html>
`
  },
  {
    path: 'src/main.ts',
    name: 'main.ts',
    category: 'Configuration',
    language: 'typescript',
    description: 'Angular bootstrap file initializing standalone root component',
    content: `import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error('Failed to bootstrap OM Polymer Angular application:', err));
`
  },

  // ==========================================
  // 2. CORE MODELS & DTOs
  // ==========================================
  {
    path: 'src/app/core/models/api-response.model.ts',
    name: 'api-response.model.ts',
    category: 'Models & DTOs',
    language: 'typescript',
    description: 'Generic response envelope matching ASP.NET Core ApiResponse<T>',
    content: `export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[] | null;
}

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}
`
  },
  {
    path: 'src/app/core/models/auth.model.ts',
    name: 'auth.model.ts',
    category: 'Models & DTOs',
    language: 'typescript',
    description: 'Authentication request, response, and administrator data models',
    content: `export interface LoginRequest {
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
`
  },
  {
    path: 'src/app/core/models/company.model.ts',
    name: 'company.model.ts',
    category: 'Models & DTOs',
    language: 'typescript',
    description: 'Company information and WhatsApp communication models',
    content: `export interface CompanySettings {
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
}

export interface WhatsAppUrlResponse {
  phoneNumber: string;
  rawNumber: string;
  message: string;
  url: string;
}
`
  },
  {
    path: 'src/app/core/models/product.model.ts',
    name: 'product.model.ts',
    category: 'Models & DTOs',
    language: 'typescript',
    description: 'Product catalog, categories, and gallery models',
    content: `export interface ProductCategory {
  categoryId: number;
  categoryName: string;
  slug: string;
}

export interface ProductImage {
  imageId: number;
  imageUrl: string;
}

export interface Product {
  productId: number;
  productName: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  specifications: string;
  mainImageUrl: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category: ProductCategory | null;
  additionalImages: ProductImage[];
}

export interface CreateProductRequest {
  productName: string;
  slug: string;
  categoryId: number;
  shortDescription?: string;
  fullDescription?: string;
  specifications?: string;
  mainImageUrl?: string;
  isFeatured?: boolean;
  additionalImages?: string[];
}
`
  },
  {
    path: 'src/app/core/models/requirement.model.ts',
    name: 'requirement.model.ts',
    category: 'Models & DTOs',
    language: 'typescript',
    description: 'Client technical requirement and lead models',
    content: `export interface RequirementCreateRequest {
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
`
  },
  {
    path: 'src/app/core/models/testimonial.model.ts',
    name: 'testimonial.model.ts',
    category: 'Models & DTOs',
    language: 'typescript',
    description: 'Customer testimonial and reviews model',
    content: `export interface Testimonial {
  testimonialId: number;
  displayName: string;
  companyOrDesignation: string;
  reviewText: string;
  rating: number;
  isApproved: boolean;
  isPublished: boolean;
  createdAt: string;
}
`
  },

  // ==========================================
  // 3. CONSTANTS
  // ==========================================
  {
    path: 'src/app/core/constants/api-endpoints.constant.ts',
    name: 'api-endpoints.constant.ts',
    category: 'Core & Services',
    language: 'typescript',
    description: 'Centralized API routes matching ASP.NET Core controllers',
    content: `export const API_ENDPOINTS = {
  COMPANY: {
    GET_INFO: '/company',
    GET_WHATSAPP_URL: '/contact/whatsapp-url',
    UPDATE: '/admin/company'
  },
  REQUIREMENTS: {
    SUBMIT: '/requirements',
    GET_ALL: '/admin/requirements',
    GET_BY_ID: (id: number) => \`/admin/requirements/\${id}\`,
    UPDATE_STATUS: (id: number) => \`/admin/requirements/\${id}/status\`
  },
  PRODUCTS: {
    LIST: '/products',
    FEATURED: '/products/featured',
    CATEGORIES: '/products/categories',
    BY_SLUG: (slug: string) => \`/products/slug/\${slug}\`,
    BY_ID: (id: number) => \`/products/\${id}\`,
    CREATE: '/admin/products',
    UPDATE: (id: number) => \`/admin/products/\${id}\`,
    TOGGLE_STATUS: (id: number) => \`/admin/products/\${id}/status\`,
    DELETE: (id: number) => \`/admin/products/\${id}\`
  },
  TESTIMONIALS: {
    PUBLIC_LIST: '/testimonials',
    ADMIN_LIST: '/admin/testimonials'
  },
  AUTH: {
    LOGIN: '/admin/auth/login',
    FORGOT_PASSWORD: '/admin/auth/forgot-password',
    RESET_PASSWORD: '/admin/auth/reset-password',
    CHANGE_PASSWORD: '/admin/auth/change-password',
    VERIFY: '/admin/auth/verify'
  },
  USERS: {
    LIST: '/admin/users',
    BY_ID: (id: number) => \`/admin/users/\${id}\`,
    CREATE: '/admin/users',
    UPDATE: (id: number) => \`/admin/users/\${id}\`,
    TOGGLE_STATUS: (id: number) => \`/admin/users/\${id}/status\`,
    DELETE: (id: number) => \`/admin/users/\${id}\`
  },
  DATABASE: {
    OVERVIEW: '/admin/database/overview',
    RESET: '/admin/database/reset'
  }
} as const;
`
  },
  {
    path: 'src/app/core/constants/app.constant.ts',
    name: 'app.constant.ts',
    category: 'Core & Services',
    language: 'typescript',
    description: 'Application branding, storage keys, and contact defaults',
    content: `export const APP_CONSTANTS = {
  STORAGE_KEYS: {
    AUTH_TOKEN: 'om_token',
    ADMIN_NAME: 'om_admin_name',
    ADMIN_ROLE: 'om_admin_role',
    THEME: 'om_theme_preference'
  },
  DEFAULT_CONTACT: {
    PHONE: '+91 8866246042',
    PHONE_TEL: 'tel:+918866246042',
    EMAIL: 'sales@ompolymer.com',
    EMAIL_MAILTO: 'mailto:sales@ompolymer.com',
    ADDRESS: 'Vegdi GIDC, Plot No. 59, Dhoraji, Gujarat, India',
    MAPS_URL: 'https://maps.google.com/?q=Vegdi+GIDC,+Plot+No.+59,+Dhoraji,+Gujarat,+India'
  },
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_SIZE: 10
  }
} as const;
`
  },

  // ==========================================
  // 4. CORE SERVICES & INTERCEPTORS
  // ==========================================
  {
    path: 'src/app/core/services/auth.service.ts',
    name: 'auth.service.ts',
    category: 'Core & Services',
    language: 'typescript',
    description: 'Authentication state manager with Angular signals, JWT storage and role tracking',
    content: `import { Injectable, inject, signal, computed } from '@angular/core';
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
    const url = \`\${environment.apiUrl}\${API_ENDPOINTS.AUTH.LOGIN}\`;
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
    const url = \`\${environment.apiUrl}\${API_ENDPOINTS.AUTH.VERIFY}\`;
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
`
  },
  {
    path: 'src/app/core/services/theme.service.ts',
    name: 'theme.service.ts',
    category: 'Core & Services',
    language: 'typescript',
    description: 'Angular Signal-based theme manager with dark mode synchronization',
    content: `import { Injectable, signal, effect } from '@angular/core';
import { APP_CONSTANTS } from '../constants/app.constant';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  theme = signal<ThemeMode>(this.getInitialTheme());

  constructor() {
    effect(() => {
      const current = this.theme();
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        if (current === 'dark') {
          root.classList.add('dark');
          document.body.classList.add('dark');
        } else {
          root.classList.remove('dark');
          document.body.classList.remove('dark');
        }
        localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.THEME, current);
      }
    });
  }

  toggleTheme(): void {
    this.theme.update(current => (current === 'light' ? 'dark' : 'light'));
  }

  isDark(): boolean {
    return this.theme() === 'dark';
  }

  private getInitialTheme(): ThemeMode {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.THEME) as ThemeMode;
      if (saved === 'dark' || saved === 'light') return saved;
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  }
}
`
  },
  {
    path: 'src/app/core/services/toast.service.ts',
    name: 'toast.service.ts',
    category: 'Core & Services',
    language: 'typescript',
    description: 'Reactive toast notification service using signals',
    content: `import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  messages = signal<ToastMessage[]>([]);

  show(toast: Omit<ToastMessage, 'id'>): void {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = {
      ...toast,
      id,
      duration: toast.duration ?? 4500
    };

    this.messages.update(list => [...list, newToast]);

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => this.remove(id), newToast.duration);
    }
  }

  success(message: string, title = 'Success'): void {
    this.show({ type: 'success', title, message });
  }

  error(message: string, title = 'Error'): void {
    this.show({ type: 'error', title, message, duration: 6000 });
  }

  info(message: string, title = 'Notice'): void {
    this.show({ type: 'info', title, message });
  }

  remove(id: string): void {
    this.messages.update(list => list.filter(m => m.id !== id));
  }
}
`
  },
  {
    path: 'src/app/core/services/company.service.ts',
    name: 'company.service.ts',
    category: 'Core & Services',
    language: 'typescript',
    description: 'Company information and WhatsApp communication service',
    content: `import { Injectable, inject } from '@angular/core';
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
    const url = \`\${environment.apiUrl}\${API_ENDPOINTS.COMPANY.GET_INFO}\`;
    return this.http.get<ApiResponse<CompanySettings>>(url);
  }

  getWhatsAppUrl(productSlug?: string, customMessage?: string): Observable<WhatsAppUrlResponse> {
    const url = \`\${environment.apiUrl}\${API_ENDPOINTS.COMPANY.GET_WHATSAPP_URL}\`;
    let params = new HttpParams();
    if (productSlug) params = params.set('productSlug', productSlug);
    if (customMessage) params = params.set('message', customMessage);

    return this.http.get<WhatsAppUrlResponse>(url, { params });
  }

  updateCompanySettings(settings: Partial<CompanySettings>): Observable<ApiResponse<boolean>> {
    const url = \`\${environment.apiUrl}\${API_ENDPOINTS.COMPANY.UPDATE}\`;
    return this.http.put<ApiResponse<boolean>>(url, settings);
  }
}
`
  },
  {
    path: 'src/app/core/services/product.service.ts',
    name: 'product.service.ts',
    category: 'Core & Services',
    language: 'typescript',
    description: 'Product catalog service for public browsing and admin management',
    content: `import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
import { ApiResponse, PagedResponse } from '../models/api-response.model';
import { Product, ProductCategory, CreateProductRequest } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);

  getProducts(page = 1, pageSize = 10, categoryId?: number, search?: string): Observable<ApiResponse<PagedResponse<Product>>> {
    const url = \`\${environment.apiUrl}\${API_ENDPOINTS.PRODUCTS.LIST}\`;
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (categoryId) params = params.set('categoryId', categoryId.toString());
    if (search?.trim()) params = params.set('search', search.trim());

    return this.http.get<ApiResponse<PagedResponse<Product>>>(url, { params });
  }

  getFeaturedProducts(): Observable<ApiResponse<Product[]>> {
    const url = \`\${environment.apiUrl}\${API_ENDPOINTS.PRODUCTS.FEATURED}\`;
    return this.http.get<ApiResponse<Product[]>>(url);
  }

  getCategories(): Observable<ApiResponse<ProductCategory[]>> {
    const url = \`\${environment.apiUrl}\${API_ENDPOINTS.PRODUCTS.CATEGORIES}\`;
    return this.http.get<ApiResponse<ProductCategory[]>>(url);
  }

  getProductBySlug(slug: string): Observable<ApiResponse<Product>> {
    const url = \`\${environment.apiUrl}\${API_ENDPOINTS.PRODUCTS.BY_SLUG(slug)}\`;
    return this.http.get<ApiResponse<Product>>(url);
  }

  createProduct(data: CreateProductRequest): Observable<ApiResponse<Product>> {
    const url = \`\${environment.apiUrl}\${API_ENDPOINTS.PRODUCTS.CREATE}\`;
    return this.http.post<ApiResponse<Product>>(url, data);
  }

  updateProduct(id: number, data: Partial<CreateProductRequest>): Observable<ApiResponse<boolean>> {
    const url = \`\${environment.apiUrl}\${API_ENDPOINTS.PRODUCTS.UPDATE(id)}\`;
    return this.http.put<ApiResponse<boolean>>(url, data);
  }

  toggleProductStatus(id: number): Observable<ApiResponse<{ isActive: boolean }>> {
    const url = \`\${environment.apiUrl}\${API_ENDPOINTS.PRODUCTS.TOGGLE_STATUS(id)}\`;
    return this.http.patch<ApiResponse<{ isActive: boolean }>>(url, {});
  }

  deleteProduct(id: number): Observable<ApiResponse<boolean>> {
    const url = \`\${environment.apiUrl}\${API_ENDPOINTS.PRODUCTS.DELETE(id)}\`;
    return this.http.delete<ApiResponse<boolean>>(url);
  }
}
`
  },
  {
    path: 'src/app/core/services/requirement.service.ts',
    name: 'requirement.service.ts',
    category: 'Core & Services',
    language: 'typescript',
    description: 'Client requirement submission and admin CRM inquiries service',
    content: `import { Injectable, inject } from '@angular/core';
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
    const url = \`\${environment.apiUrl}\${API_ENDPOINTS.REQUIREMENTS.SUBMIT}\`;
    return this.http.post<ApiResponse<boolean>>(url, req);
  }

  // Admin inquiries CRM
  getAdminRequirements(page = 1, pageSize = 10, status = 'All', search = ''): Observable<ApiResponse<PagedResponse<ClientRequirement>>> {
    const url = \`\${environment.apiUrl}\${API_ENDPOINTS.REQUIREMENTS.GET_ALL}\`;
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (status && status !== 'All') params = params.set('status', status);
    if (search.trim()) params = params.set('search', search.trim());

    return this.http.get<ApiResponse<PagedResponse<ClientRequirement>>>(url, { params });
  }

  updateStatus(id: number, payload: UpdateRequirementStatusRequest): Observable<ApiResponse<ClientRequirement>> {
    const url = \`\${environment.apiUrl}\${API_ENDPOINTS.REQUIREMENTS.UPDATE_STATUS(id)}\`;
    return this.http.patch<ApiResponse<ClientRequirement>>(url, payload);
  }
}
`
  },
  {
    path: 'src/app/core/services/admin-user.service.ts',
    name: 'admin-user.service.ts',
    category: 'Core & Services',
    language: 'typescript',
    description: 'SuperAdmin administrative users CRUD service',
    content: `import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
import { ApiResponse, PagedResponse } from '../models/api-response.model';
import { AdminUser, CreateAdminRequest, UpdateAdminRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  private http = inject(HttpClient);

  getUsers(page = 1, pageSize = 10, role = 'All', status = 'All', search = ''): Observable<ApiResponse<PagedResponse<AdminUser>>> {
    const url = \`\${environment.apiUrl}\${API_ENDPOINTS.USERS.LIST}\`;
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (role && role !== 'All') params = params.set('role', role);
    if (status && status !== 'All') params = params.set('status', status);
    if (search.trim()) params = params.set('search', search.trim());

    return this.http.get<ApiResponse<PagedResponse<AdminUser>>>(url, { params });
  }

  createUser(data: CreateAdminRequest): Observable<ApiResponse<AdminUser>> {
    const url = \`\${environment.apiUrl}\${API_ENDPOINTS.USERS.CREATE}\`;
    return this.http.post<ApiResponse<AdminUser>>(url, data);
  }

  updateUser(id: number, data: UpdateAdminRequest): Observable<ApiResponse<AdminUser>> {
    const url = \`\${environment.apiUrl}\${API_ENDPOINTS.USERS.UPDATE(id)}\`;
    return this.http.put<ApiResponse<AdminUser>>(url, data);
  }

  toggleUserStatus(id: number): Observable<ApiResponse<AdminUser>> {
    const url = \`\${environment.apiUrl}\${API_ENDPOINTS.USERS.TOGGLE_STATUS(id)}\`;
    return this.http.patch<ApiResponse<AdminUser>>(url, {});
  }

  deleteUser(id: number): Observable<ApiResponse<boolean>> {
    const url = \`\${environment.apiUrl}\${API_ENDPOINTS.USERS.DELETE(id)}\`;
    return this.http.delete<ApiResponse<boolean>>(url);
  }
}
`
  },

  // ==========================================
  // 5. INTERCEPTORS & GUARDS
  // ==========================================
  {
    path: 'src/app/core/interceptors/auth.interceptor.ts',
    name: 'auth.interceptor.ts',
    category: 'Interceptors & Guards',
    language: 'typescript',
    description: 'Functional HTTP interceptor attaching JWT Bearer token to /api/admin/* endpoints',
    content: `import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Attach Authorization Bearer token to administrative routes
  if (token && req.url.includes('/admin/')) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: \`Bearer \${token}\`
      }
    });
    return next(cloned);
  }

  return next(req);
};
`
  },
  {
    path: 'src/app/core/interceptors/error.interceptor.ts',
    name: 'error.interceptor.ts',
    category: 'Interceptors & Guards',
    language: 'typescript',
    description: 'Functional HTTP interceptor handling 400, 401, 403, 404, 429 and 500 status codes',
    content: `import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected network error occurred.';

      if (error.error) {
        if (typeof error.error.message === 'string') {
          errorMessage = error.error.message;
        } else if (Array.isArray(error.error.errors) && error.error.errors.length > 0) {
          errorMessage = error.error.errors[0];
        }
      }

      switch (error.status) {
        case 400:
          toast.error(errorMessage, 'Validation Notice');
          break;
        case 401:
          toast.error('Session expired or unauthorized. Please log in again.', 'Authentication Required');
          authService.logout();
          if (router.url.startsWith('/admin')) {
            router.navigate(['/auth/login'], { queryParams: { returnUrl: router.url } });
          }
          break;
        case 403:
          toast.error('Access restricted. Your current role does not permit this operation.', 'Access Forbidden');
          break;
        case 404:
          toast.error('The requested record or resource was not found.', 'Not Found');
          break;
        case 429:
          toast.error('Rate limit reached. Please wait a minute before making further submissions.', 'Too Many Requests');
          break;
        case 500:
          toast.error('Server encountered an issue. Our engineering team has been notified.', 'Server Error');
          break;
        default:
          toast.error(errorMessage, \`HTTP \${error.status || 'Network'} Error\`);
          break;
      }

      return throwError(() => error);
    })
  );
};
`
  },
  {
    path: 'src/app/core/guards/auth.guard.ts',
    name: 'auth.guard.ts',
    category: 'Interceptors & Guards',
    language: 'typescript',
    description: 'Functional CanActivate guard securing the /admin route hierarchy',
    content: `import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  if (authService.isAuthenticated()) {
    return true;
  }

  toast.info('Please log in with administrator credentials to enter the Admin Panel.', 'Authentication Required');
  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
};
`
  },
  {
    path: 'src/app/core/guards/role.guard.ts',
    name: 'role.guard.ts',
    category: 'Interceptors & Guards',
    language: 'typescript',
    description: 'Functional CanActivate guard restricting SuperAdmin-only administrative actions',
    content: `import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const superAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  if (authService.isAuthenticated() && authService.isSuperAdmin()) {
    return true;
  }

  toast.error('This administrative module requires Super Administrator privileges.', 'Access Denied');
  return router.createUrlTree(['/admin/dashboard']);
};
`
  },

  // ==========================================
  // 6. LAYOUTS
  // ==========================================
  {
    path: 'src/app/layouts/public-layout/public-layout.component.ts',
    name: 'public-layout.component.ts',
    category: 'Layouts',
    language: 'typescript',
    description: 'Public minimal layout shell used for authentication screens',
    content: `import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  template: \`
    <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4">
      <header class="max-w-7xl w-full mx-auto py-4 flex items-center justify-between">
        <a routerLink="/" class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center font-bold text-white shadow-md">
            OM
          </div>
          <span class="font-bold text-base tracking-tight text-white">OM POLYMER</span>
        </a>
        <a routerLink="/" class="text-xs text-slate-400 hover:text-white transition-colors">
          ← Back to Client Portal
        </a>
      </header>

      <main class="flex-1 flex items-center justify-center py-8">
        <router-outlet></router-outlet>
      </main>

      <footer class="text-center py-4 text-xs text-slate-500">
        © 2026 OM POLYMER · Administrative Access Portal · ISO 9001
      </footer>
    </div>
  \`
})
export class PublicLayoutComponent {}
`
  },
  {
    path: 'src/app/layouts/user-layout/user-layout.component.ts',
    name: 'user-layout.component.ts',
    category: 'Layouts',
    language: 'typescript',
    description: 'User client-facing layout with top navigation header, theme switch and contact footer',
    content: `import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  template: \`
    <div class="min-h-screen bg-[#f5f8ff] text-[#172554] dark:bg-[#0f172a] dark:text-[#e2e8f0] flex flex-col transition-colors duration-300">
      
      <!-- Top Navigation Header -->
      <header class="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-3.5 transition-colors">
        <div class="max-w-7xl mx-auto flex items-center justify-between gap-6">
          
          <!-- Logo & Brand Mark -->
          <a routerLink="/" class="flex items-center gap-3 shrink-0">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-white font-extrabold text-lg shadow-md">
              OM
            </div>
            <div>
              <span class="font-extrabold text-base tracking-tight leading-none text-[#172554] dark:text-white block">
                OM POLYMER
              </span>
              <span class="text-[10px] font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400">
                Extrusion & Compounding
              </span>
            </div>
          </a>

          <!-- Navigation Links -->
          <nav class="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider">
            <a routerLink="/" routerLinkActive="text-blue-600 dark:text-blue-400 font-bold" [routerLinkActiveOptions]="{exact: true}" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Home
            </a>
            <a routerLink="/products" routerLinkActive="text-blue-600 dark:text-blue-400 font-bold" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Products
            </a>
            <a routerLink="/quote" routerLinkActive="text-blue-600 dark:text-blue-400 font-bold" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Request Quotation
            </a>
            <a routerLink="/maintenance" routerLinkActive="text-blue-600 dark:text-blue-400 font-bold" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Maintenance Ref
            </a>
          </nav>

          <!-- Action Buttons & Auth Switcher -->
          <div class="flex items-center gap-3">
            <!-- Theme Toggle -->
            <button 
              (click)="theme.toggleTheme()" 
              class="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm flex items-center justify-center text-base hover:scale-110 active:scale-95 transition-all"
              [title]="theme.isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
            >
              {{ theme.isDark() ? '☀️' : '🌙' }}
            </button>

            <!-- Admin Entry -->
            <ng-container *ngIf="auth.isAuthenticated(); else loginLink">
              <a routerLink="/admin/dashboard" class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all">
                <span>⚡ Admin Dashboard</span>
              </a>
            </ng-container>
            <ng-template #loginLink>
              <a routerLink="/auth/login" class="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors">
                Admin Login
              </a>
            </ng-template>
          </div>
        </div>
      </header>

      <!-- Main User Page Content -->
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>

      <!-- User Experience Footer -->
      <footer class="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 px-6 text-xs text-slate-500 transition-colors">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="font-extrabold text-sm text-slate-800 dark:text-white">OM POLYMER</div>
            <span>· ISO 9001 Certified · High-Density Polyethylene & Polymer Extrusion</span>
          </div>
          <div class="flex items-center gap-4 text-slate-400">
            <span>Dhoraji & Ahmedabad, Gujarat</span>
            <a routerLink="/auth/login" class="hover:text-blue-500 transition-colors">Admin Console</a>
          </div>
        </div>
      </footer>
    </div>
  \`
})
export class UserLayoutComponent {
  theme = inject(ThemeService);
  auth = inject(AuthService);
}
`
  },
  {
    path: 'src/app/layouts/admin-layout/admin-layout.component.ts',
    name: 'admin-layout.component.ts',
    category: 'Layouts',
    language: 'typescript',
    description: 'Admin layout with dark sidebar, top admin header, role pill and logout workflow',
    content: `import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  template: \`
    <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      
      <!-- Collapsible / Fixed Admin Sidebar -->
      <aside class="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between shrink-0">
        <div>
          <!-- Sidebar Header Brand -->
          <div class="flex items-center gap-3 mb-8">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-white font-extrabold text-lg shadow-md">
              OM
            </div>
            <div>
              <span class="font-extrabold text-sm tracking-tight text-white block">OM POLYMER</span>
              <span class="text-[10px] font-bold tracking-wider uppercase text-blue-400">Admin Control</span>
            </div>
          </div>

          <!-- Role Pill -->
          <div class="mb-6 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div class="text-[11px] text-slate-400">Logged in as</div>
              <div class="text-xs font-semibold text-white truncate max-w-[130px]">{{ auth.adminName() }}</div>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
              [ngClass]="auth.isSuperAdmin() ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'">
              {{ auth.role() }}
            </span>
          </div>

          <!-- Navigation Links -->
          <nav class="space-y-1 text-xs font-medium">
            <a routerLink="/admin/dashboard" routerLinkActive="bg-blue-600 text-white font-semibold" class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">
              <span>📊</span> Dashboard Overview
            </a>
            <a routerLink="/admin/inquiries" routerLinkActive="bg-blue-600 text-white font-semibold" class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">
              <span>📋</span> Inquiries & Leads CRM
            </a>
            <a routerLink="/admin/products" routerLinkActive="bg-blue-600 text-white font-semibold" class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">
              <span>📦</span> Product Catalog
            </a>
            <a routerLink="/admin/company" routerLinkActive="bg-blue-600 text-white font-semibold" class="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors">
              <span>🏢</span> Company & WhatsApp
            </a>

            <!-- SuperAdmin Exclusive Navigation Link -->
            <a 
              *ngIf="auth.isSuperAdmin()"
              routerLink="/admin/users" 
              routerLinkActive="bg-blue-600 text-white font-semibold" 
              class="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <div class="flex items-center gap-3">
                <span>🛡️</span> Administrators
              </div>
              <span class="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">Root</span>
            </a>
          </nav>
        </div>

        <!-- Sidebar Bottom Actions -->
        <div class="pt-6 border-t border-slate-800 space-y-2 text-xs">
          <a routerLink="/" class="flex items-center gap-2 px-3.5 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <span>🌐</span> Client Portal
          </a>
          <button (click)="handleLogout()" class="w-full text-left flex items-center gap-2 px-3.5 py-2 rounded-lg text-rose-400 hover:bg-rose-950/40 transition-colors font-medium">
            <span>🚪</span> Log Out
          </button>
        </div>
      </aside>

      <!-- Main Admin Workspace Viewport -->
      <main class="flex-1 flex flex-col overflow-x-hidden">
        <header class="bg-slate-900/60 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between">
          <div class="text-xs text-slate-400">
            Administrative Console · <span class="text-slate-200 font-medium">OM Polymer Web API</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span class="text-xs font-mono text-emerald-400">API Connected</span>
          </div>
        </header>

        <div class="flex-1 p-6 md:p-8">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  \`
})
export class AdminLayoutComponent {
  auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  handleLogout(): void {
    this.auth.logout();
    this.toast.info('You have logged out of the Admin Panel.');
    this.router.navigate(['/']);
  }
}
`
  },

  // ==========================================
  // 7. USER FEATURES
  // ==========================================
  {
    path: 'src/app/features/user/home/user-home.component.ts',
    name: 'user-home.component.ts',
    category: 'User Portal',
    language: 'typescript',
    description: 'User landing page featuring hero section, capabilities, featured products, and contact cards',
    content: `import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CompanyService } from '../../../core/services/company.service';
import { Product } from '../../../core/models/product.model';
import { CompanySettings } from '../../../core/models/company.model';
import { APP_CONSTANTS } from '../../../core/constants/app.constant';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: \`
    <div class="space-y-16 py-10 px-6 max-w-7xl mx-auto">
      
      <!-- Hero Section -->
      <section class="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 p-8 sm:p-14 text-white shadow-2xl">
        <div class="max-w-2xl space-y-6 relative z-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            ISO 9001:2015 CERTIFIED MANUFACTURING
          </div>
          <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Advanced Polymer Extrusion & High-Tensile Piping Solutions
          </h1>
          <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
            Delivering high-density polyethylene (HDPE) pipes, custom compounding resins, and specialized industrial polymers designed for extreme hydrostatic pressures.
          </p>
          <div class="flex flex-wrap gap-3 pt-2">
            <a routerLink="/products" class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-transform hover:scale-105 active:scale-95">
              Browse Products Catalog
            </a>
            <a routerLink="/quote" class="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs transition-colors">
              Request Technical Quote
            </a>
          </div>
        </div>
      </section>

      <!-- Key Engineering Statistics -->
      <section class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div class="text-3xl font-extrabold text-blue-600 dark:text-blue-400">13+</div>
          <div class="text-xs text-slate-500 mt-1">Years of Manufacturing</div>
        </div>
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div class="text-3xl font-extrabold text-blue-600 dark:text-blue-400">50K+</div>
          <div class="text-xs text-slate-500 mt-1">Metric Tons Annual Output</div>
        </div>
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div class="text-3xl font-extrabold text-blue-600 dark:text-blue-400">ISO</div>
          <div class="text-xs text-slate-500 mt-1">9001:2015 Accredited</div>
        </div>
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div class="text-3xl font-extrabold text-blue-600 dark:text-blue-400">100%</div>
          <div class="text-xs text-slate-500 mt-1">Virgin Polymer Raw Resins</div>
        </div>
      </section>

      <!-- Featured Products Grid -->
      <section class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold">Featured Industrial Products</h2>
            <p class="text-xs text-slate-500 mt-1">Pre-tested specifications conforming to ISO 4427 and ASTM standards</p>
          </div>
          <a routerLink="/products" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            View All Products →
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div *ngFor="let p of featuredProducts()" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-xl transition-all">
            <div class="p-5 space-y-3">
              <span class="px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                {{ p.category?.categoryName || 'Industrial' }}
              </span>
              <h3 class="font-bold text-base leading-tight">{{ p.productName }}</h3>
              <p class="text-xs text-slate-500 line-clamp-3 leading-relaxed">{{ p.shortDescription }}</p>
            </div>
            <div class="p-5 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 mt-4">
              <a [routerLink]="['/products', p.slug]" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                View Specs
              </a>
              <a routerLink="/quote" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 dark:bg-slate-800 text-white hover:bg-blue-600 transition-colors">
                Request RFQ
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Interactive Contact Cards from Design Reference -->
      <section class="space-y-6 pt-6">
        <div class="text-center max-w-xl mx-auto">
          <h2 class="text-2xl font-bold">Direct Engineering Contacts</h2>
          <p class="text-xs text-slate-500 mt-1">Connect directly with our materials engineering sales desk</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a [href]="phoneTel" class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl text-center space-y-2 transition-all hover:-translate-y-1">
            <div class="w-12 h-12 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 mx-auto flex items-center justify-center text-xl">📞</div>
            <div class="font-bold text-sm">Phone Support</div>
            <div class="text-xs font-mono text-slate-500">{{ phone }}</div>
          </a>

          <a [href]="emailMailto" class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl text-center space-y-2 transition-all hover:-translate-y-1">
            <div class="w-12 h-12 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 mx-auto flex items-center justify-center text-xl">✉️</div>
            <div class="font-bold text-sm">Email Inquiry</div>
            <div class="text-xs text-slate-500">{{ email }}</div>
          </a>

          <a [href]="mapsUrl" target="_blank" rel="noopener noreferrer" class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl text-center space-y-2 transition-all hover:-translate-y-1">
            <div class="w-12 h-12 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 mx-auto flex items-center justify-center text-xl">🏢</div>
            <div class="font-bold text-sm">Manufacturing Plant</div>
            <div class="text-xs text-slate-500">Vegdi GIDC, Dhoraji, Gujarat</div>
          </a>
        </div>
      </section>
    </div>
  \`
})
export class UserHomeComponent implements OnInit {
  private prodService = inject(ProductService);
  private compService = inject(CompanyService);

  featuredProducts = signal<Product[]>([]);
  company = signal<CompanySettings | null>(null);

  phone = APP_CONSTANTS.DEFAULT_CONTACT.PHONE;
  phoneTel = APP_CONSTANTS.DEFAULT_CONTACT.PHONE_TEL;
  email = APP_CONSTANTS.DEFAULT_CONTACT.EMAIL;
  emailMailto = APP_CONSTANTS.DEFAULT_CONTACT.EMAIL_MAILTO;
  mapsUrl = APP_CONSTANTS.DEFAULT_CONTACT.MAPS_URL;

  ngOnInit(): void {
    this.prodService.getFeaturedProducts().subscribe({
      next: res => {
        if (res.success && res.data) this.featuredProducts.set(res.data);
      }
    });

    this.compService.getCompanySettings().subscribe({
      next: res => {
        if (res.success && res.data) {
          this.company.set(res.data);
          if (res.data.phoneContact) {
            this.phone = res.data.phoneContact;
            this.phoneTel = \`tel:\${res.data.phoneContact.replace(/\\s+/g, '')}\`;
          }
          if (res.data.emailContact) {
            this.email = res.data.emailContact;
            this.emailMailto = \`mailto:\${res.data.emailContact}\`;
          }
        }
      }
    });
  }
}
`
  },
  {
    path: 'src/app/features/user/catalog/product-catalog.component.ts',
    name: 'product-catalog.component.ts',
    category: 'User Portal',
    language: 'typescript',
    description: 'Products catalog component with category filtering and keyword search',
    content: `import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product, ProductCategory } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: \`
    <div class="py-10 px-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight">Industrial Products Catalog</h1>
        <p class="text-xs text-slate-500 mt-1">Explore our ISO-certified polyethylene piping systems and compounds</p>
      </div>

      <!-- Search & Category Filters -->
      <div class="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div class="flex flex-wrap gap-2">
          <button 
            (click)="selectCategory(undefined)"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            [ngClass]="selectedCategoryId() === undefined ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'"
          >
            All Products
          </button>
          <button 
            *ngFor="let cat of categories()"
            (click)="selectCategory(cat.categoryId)"
            class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            [ngClass]="selectedCategoryId() === cat.categoryId ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'"
          >
            {{ cat.categoryName }}
          </button>
        </div>

        <input 
          type="text" 
          [(ngModel)]="searchQuery" 
          (ngModelChange)="loadProducts()"
          placeholder="Search by name, spec, or standard..." 
          class="w-full md:w-72 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
        />
      </div>

      <!-- Products Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div *ngFor="let p of products()" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-lg transition-all">
          <div class="p-5 space-y-3">
            <span class="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              {{ p.category?.categoryName }}
            </span>
            <h3 class="font-bold text-base leading-tight">{{ p.productName }}</h3>
            <p class="text-xs text-slate-500 line-clamp-3 leading-relaxed">{{ p.shortDescription }}</p>
            <div class="text-[11px] font-mono bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
              {{ p.specifications }}
            </div>
          </div>
          <div class="p-5 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 mt-4">
            <a [routerLink]="['/products', p.slug]" class="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Technical Details →
            </a>
            <a routerLink="/quote" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors">
              RFQ
            </a>
          </div>
        </div>
      </div>
    </div>
  \`
})
export class ProductCatalogComponent implements OnInit {
  private prodService = inject(ProductService);

  products = signal<Product[]>([]);
  categories = signal<ProductCategory[]>([]);
  selectedCategoryId = signal<number | undefined>(undefined);
  searchQuery = '';

  ngOnInit(): void {
    this.prodService.getCategories().subscribe(res => {
      if (res.success && res.data) this.categories.set(res.data);
    });
    this.loadProducts();
  }

  selectCategory(id?: number): void {
    this.selectedCategoryId.set(id);
    this.loadProducts();
  }

  loadProducts(): void {
    this.prodService.getProducts(1, 50, this.selectedCategoryId(), this.searchQuery).subscribe(res => {
      if (res.success && res.data) this.products.set(res.data.items);
    });
  }
}
`
  },
  {
    path: 'src/app/features/user/product-detail/product-detail.component.ts',
    name: 'product-detail.component.ts',
    category: 'User Portal',
    language: 'typescript',
    description: 'Product detail view showing comprehensive technical specifications and direct RFQ link',
    content: `import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: \`
    <div class="py-10 px-6 max-w-5xl mx-auto space-y-8" *ngIf="product(); else loadingTpl">
      <div>
        <a routerLink="/products" class="text-xs text-blue-600 hover:underline">← Back to Catalog</a>
        <h1 class="text-3xl font-extrabold tracking-tight mt-2">{{ product()?.productName }}</h1>
        <div class="text-xs text-slate-500 mt-1">Category: {{ product()?.category?.categoryName }}</div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-2 space-y-6">
          <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 class="text-base font-bold">Engineering Overview</h2>
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{{ product()?.fullDescription }}</p>
          </div>

          <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 class="text-base font-bold">Technical Specifications</h2>
            <div class="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl font-mono text-xs text-slate-700 dark:text-slate-300">
              {{ product()?.specifications }}
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div class="bg-blue-50 dark:bg-slate-900 p-6 rounded-2xl border border-blue-200 dark:border-slate-800 space-y-4">
            <h3 class="font-bold text-sm">Need Quotation for this Product?</h3>
            <p class="text-xs text-slate-500">Contact our engineering desk for custom diameters, SDR rating and pricing.</p>
            <a routerLink="/quote" class="block text-center py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-md transition-colors">
              Request Specific Quote
            </a>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loadingTpl>
      <div class="py-20 text-center text-xs text-slate-500">Loading product specifications...</div>
    </ng-template>
  \`
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private prodService = inject(ProductService);

  product = signal<Product | null>(null);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.prodService.getProductBySlug(slug).subscribe(res => {
        if (res.success && res.data) this.product.set(res.data);
      });
    }
  }
}
`
  },
  {
    path: 'src/app/features/user/rfq/user-rfq.component.ts',
    name: 'user-rfq.component.ts',
    category: 'User Portal',
    language: 'typescript',
    description: 'Technical quotation and client requirement reactive form',
    content: `import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RequirementService } from '../../../core/services/requirement.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-user-rfq',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: \`
    <div class="py-12 px-6 max-w-3xl mx-auto">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
        <div>
          <span class="px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
            Direct Engineering Inquiry
          </span>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">Technical Quotation & RFQ Form</h1>
          <p class="text-xs text-slate-500 mt-1">Submit your engineering specs for HDPE pipes, SDR ratings, and compounding requirements.</p>
        </div>

        <form [formGroup]="rfqForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold mb-1">Full Name *</label>
              <input formControlName="fullName" type="text" placeholder="e.g. Ramesh Patel" class="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
            </div>
            <div>
              <label class="block text-xs font-semibold mb-1">Company / Organization</label>
              <input formControlName="companyName" type="text" placeholder="e.g. Gujarat Polymer Infra Ltd" class="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold mb-1">Email Address *</label>
              <input formControlName="email" type="email" placeholder="contact@example.com" class="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
            </div>
            <div>
              <label class="block text-xs font-semibold mb-1">Phone Number *</label>
              <input formControlName="phoneNumber" type="tel" placeholder="+91 98765 43210" class="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold mb-1">Product of Interest</label>
              <input formControlName="productOfInterest" type="text" placeholder="e.g. HDPE PN16 Pipes" class="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
            </div>
            <div>
              <label class="block text-xs font-semibold mb-1">Estimated Quantity</label>
              <input formControlName="quantity" type="text" placeholder="e.g. 5,000 meters" class="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold mb-1">Technical Requirement Details *</label>
            <textarea formControlName="requirementDescription" rows="4" placeholder="Detail diameter requirements, SDR ratings, operating temperatures, or custom extrusion requests..." class="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"></textarea>
          </div>

          <button 
            type="submit" 
            [disabled]="loading()"
            class="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md transition-colors disabled:opacity-50"
          >
            {{ loading() ? 'Submitting to Engineering Team...' : 'Transmit Technical Specification' }}
          </button>
        </form>
      </div>
    </div>
  \`
})
export class UserRfqComponent {
  private fb = inject(FormBuilder);
  private reqService = inject(RequirementService);
  private toast = inject(ToastService);

  loading = signal(false);

  rfqForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.maxLength(150)]],
    companyName: [''],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(20)]],
    productOfInterest: ['HDPE PN16 Pipes'],
    quantity: [''],
    requirementDescription: ['', [Validators.required, Validators.minLength(5)]]
  });

  onSubmit(): void {
    if (this.rfqForm.invalid) {
      this.rfqForm.markAllAsTouched();
      this.toast.error('Please complete all required fields correctly.');
      return;
    }

    this.loading.set(true);
    this.reqService.submitRequirement(this.rfqForm.value).subscribe({
      next: res => {
        this.loading.set(false);
        this.toast.success(res.message);
        this.rfqForm.reset({ productOfInterest: 'HDPE PN16 Pipes' });
      },
      error: () => this.loading.set(false)
    });
  }
}
`
  },
  {
    path: 'src/app/features/user/maintenance-ref/maintenance-ref.component.ts',
    name: 'maintenance-ref.component.ts',
    category: 'User Portal',
    language: 'typescript',
    description: 'Faithful responsive recreation of the user reference maintenance webpage',
    content: `import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APP_CONSTANTS } from '../../../core/constants/app.constant';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-maintenance-ref',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div class="relative min-h-[600px] flex items-center justify-center p-6 sm:p-12 overflow-hidden text-center">
      
      <!-- Ambient Circles -->
      <div class="absolute rounded-full pointer-events-none w-[350px] h-[350px] bg-blue-100 dark:bg-blue-900/10 -top-[120px] -left-[100px] animate-pulse"></div>
      <div class="absolute rounded-full pointer-events-none w-[280px] h-[280px] bg-indigo-100 dark:bg-indigo-900/10 -bottom-[100px] -right-[80px] animate-pulse"></div>

      <div class="max-w-2xl relative z-10 flex flex-col items-center">
        
        <!-- Illustration -->
        <div class="w-[280px] h-[200px] mx-auto mb-4 relative">
          <div class="absolute w-[190px] h-[125px] bg-[#172554] rounded-xl left-[45px] top-[25px] p-2.5 shadow-2xl">
            <div class="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-md flex flex-col items-center justify-center gap-2">
              <div class="text-4xl anim-gear">⚙️</div>
              <div class="w-20 h-1.5 bg-blue-200 rounded-full overflow-hidden anim-loading-bar"></div>
            </div>
          </div>
          <div class="absolute w-[220px] h-[10px] bg-slate-500 rounded-b-[18px] bottom-[48px] left-[30px]"></div>

          <div class="absolute right-[5px] bottom-[40px]">
            <div class="w-9 h-9 rounded-full bg-[#f8c9a0] mx-auto relative">
              <div class="absolute w-[46px] h-[18px] bg-[#fbbf24] rounded-t-[24px] rounded-b-[4px] -top-[6px] -left-[5px] shadow-sm"></div>
            </div>
            <div class="w-12 h-14 bg-blue-600 rounded-t-xl rounded-b-md mt-1 mx-auto"></div>
            <div class="absolute text-3xl -right-[30px] top-[45px] -rotate-[30deg]">🔧</div>
          </div>
        </div>

        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-4 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          MAINTENANCE REFERENCE VIEW
        </div>

        <h1 class="text-4xl font-extrabold tracking-tight mb-3">
          Site <span class="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Under Maintenance</span>
        </h1>

        <p class="text-xs sm:text-sm text-slate-500 max-w-lg mb-8 leading-relaxed">
          We're currently working behind the scenes to improve our website and provide you with a better experience. We'll be back online shortly.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          <a [href]="phoneTel" class="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all flex flex-col items-center">
            <span class="text-2xl mb-1">📞</span>
            <strong class="text-xs">Phone Support</strong>
            <span class="text-[11px] font-mono text-slate-500">{{ phone }}</span>
          </a>
          <a [href]="emailMailto" class="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all flex flex-col items-center">
            <span class="text-2xl mb-1">✉️</span>
            <strong class="text-xs">Email Us</strong>
            <span class="text-[11px] text-slate-500">{{ email }}</span>
          </a>
          <a [href]="mapsUrl" target="_blank" rel="noopener noreferrer" class="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all flex flex-col items-center">
            <span class="text-2xl mb-1">🏢</span>
            <strong class="text-xs">Head Office</strong>
            <span class="text-[10px] text-slate-500">Vegdi GIDC, Dhoraji</span>
          </a>
        </div>
      </div>
    </div>
  \`
})
export class MaintenanceRefComponent {
  theme = inject(ThemeService);
  phone = APP_CONSTANTS.DEFAULT_CONTACT.PHONE;
  phoneTel = APP_CONSTANTS.DEFAULT_CONTACT.PHONE_TEL;
  email = APP_CONSTANTS.DEFAULT_CONTACT.EMAIL;
  emailMailto = APP_CONSTANTS.DEFAULT_CONTACT.EMAIL_MAILTO;
  mapsUrl = APP_CONSTANTS.DEFAULT_CONTACT.MAPS_URL;
}
`
  },

  // ==========================================
  // 8. ADMIN FEATURES
  // ==========================================
  {
    path: 'src/app/features/admin/dashboard/admin-dashboard.component.ts',
    name: 'admin-dashboard.component.ts',
    category: 'Admin Panel',
    language: 'typescript',
    description: 'Admin dashboard with summary metrics, CRM recent leads, and quick actions',
    content: `import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RequirementService } from '../../../core/services/requirement.service';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { ClientRequirement } from '../../../core/models/requirement.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: \`
    <div class="space-y-8">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">System Overview Dashboard</h1>
        <p class="text-xs text-slate-400 mt-1">OM Polymer administrative metrics and operational controls</p>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div class="text-xs font-semibold text-slate-400">Total Leads & RFQs</div>
          <div class="text-3xl font-extrabold text-blue-400">{{ totalInquiries() }}</div>
          <div class="text-[11px] text-slate-500">Recorded through POST /api/requirements</div>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div class="text-xs font-semibold text-slate-400">New Pending Leads</div>
          <div class="text-3xl font-extrabold text-amber-400">{{ newInquiriesCount() }}</div>
          <div class="text-[11px] text-slate-500">Awaiting engineering response</div>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div class="text-xs font-semibold text-slate-400">Catalog Products</div>
          <div class="text-3xl font-extrabold text-emerald-400">{{ totalProducts() }}</div>
          <div class="text-[11px] text-slate-500">Active HDPE & polymer lines</div>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div class="text-xs font-semibold text-slate-400">Current Role Claim</div>
          <div class="text-xl font-extrabold text-purple-400">{{ auth.role() }}</div>
          <div class="text-[11px] text-slate-500">{{ auth.adminName() }}</div>
        </div>
      </div>

      <!-- Recent Inquiries Table -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden space-y-4 p-5">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-bold uppercase tracking-wider text-slate-200">Recent Customer Inquiries</h2>
          <a routerLink="/admin/inquiries" class="text-xs text-blue-400 hover:underline">View All CRM Leads →</a>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th class="p-3">Client</th>
                <th class="p-3">Contact</th>
                <th class="p-3">Product</th>
                <th class="p-3">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              <tr *ngFor="let item of recentInquiries()">
                <td class="p-3">
                  <div class="font-semibold text-white">{{ item.fullName }}</div>
                  <div class="text-[11px] text-slate-400">{{ item.companyName || 'Independent' }}</div>
                </td>
                <td class="p-3">
                  <div>{{ item.email }}</div>
                  <div class="font-mono text-slate-400">{{ item.phoneNumber }}</div>
                </td>
                <td class="p-3">{{ item.productOfInterest }}</td>
                <td class="p-3">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold"
                    [ngClass]="{
                      'bg-emerald-950 text-emerald-400 border border-emerald-800': item.status === 'Completed',
                      'bg-blue-950 text-blue-400 border border-blue-800': item.status === 'New',
                      'bg-amber-950 text-amber-400 border border-amber-800': item.status === 'Contacted' || item.status === 'In Progress'
                    }">
                    {{ item.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  \`
})
export class AdminDashboardComponent implements OnInit {
  auth = inject(AuthService);
  private reqService = inject(RequirementService);
  private prodService = inject(ProductService);

  totalInquiries = signal(0);
  newInquiriesCount = signal(0);
  totalProducts = signal(0);
  recentInquiries = signal<ClientRequirement[]>([]);

  ngOnInit(): void {
    this.reqService.getAdminRequirements(1, 5).subscribe(res => {
      if (res.success && res.data) {
        this.totalInquiries.set(res.data.totalCount);
        this.recentInquiries.set(res.data.items);
        this.newInquiriesCount.set(res.data.items.filter(i => i.status === 'New').length);
      }
    });

    this.prodService.getProducts(1, 1).subscribe(res => {
      if (res.success && res.data) {
        this.totalProducts.set(res.data.totalCount);
      }
    });
  }
}
`
  },
  {
    path: 'src/app/features/admin/inquiries/admin-inquiries.component.ts',
    name: 'admin-inquiries.component.ts',
    category: 'Admin Panel',
    language: 'typescript',
    description: 'Inquiries CRM management with filtering, remarks updating, and pagination',
    content: `import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequirementService } from '../../../core/services/requirement.service';
import { ToastService } from '../../../core/services/toast.service';
import { ClientRequirement, RequirementStatus } from '../../../core/models/requirement.model';

@Component({
  selector: 'app-admin-inquiries',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: \`
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Client Inquiries & Leads CRM</h1>
          <p class="text-xs text-slate-400 mt-1">Review quotation requests and update lead progression status</p>
        </div>
      </div>

      <!-- Filter Controls -->
      <div class="flex flex-col sm:flex-row gap-3">
        <input 
          type="text" 
          [(ngModel)]="search" 
          (ngModelChange)="loadData()" 
          placeholder="Search by client name, email, phone, product..." 
          class="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
        />
        <select 
          [(ngModel)]="statusFilter" 
          (ngModelChange)="loadData()" 
          class="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white"
        >
          <option value="All">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <!-- Inquiries Table -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th class="p-3">Client</th>
              <th class="p-3">Contact Details</th>
              <th class="p-3">Product / Qty</th>
              <th class="p-3">Requirement Description</th>
              <th class="p-3">Status</th>
              <th class="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr *ngFor="let item of items()">
              <td class="p-3">
                <div class="font-bold text-white">{{ item.fullName }}</div>
                <div class="text-[11px] text-slate-400">{{ item.companyName || 'Independent' }}</div>
              </td>
              <td class="p-3">
                <div>{{ item.email }}</div>
                <div class="font-mono text-slate-400">{{ item.phoneNumber }}</div>
              </td>
              <td class="p-3">
                <div class="font-semibold">{{ item.productOfInterest }}</div>
                <div class="text-slate-400">{{ item.quantity }}</div>
              </td>
              <td class="p-3 max-w-xs truncate">{{ item.requirementDescription }}</td>
              <td class="p-3">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold"
                  [ngClass]="{
                    'bg-emerald-950 text-emerald-400 border border-emerald-800': item.status === 'Completed',
                    'bg-blue-950 text-blue-400 border border-blue-800': item.status === 'New',
                    'bg-amber-950 text-amber-400 border border-amber-800': item.status === 'Contacted' || item.status === 'In Progress',
                    'bg-rose-950 text-rose-400 border border-rose-800': item.status === 'Rejected'
                  }">
                  {{ item.status }}
                </span>
              </td>
              <td class="p-3 text-right">
                <button (click)="openStatusModal(item)" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors">
                  Update
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Status Updater Modal -->
      <div *ngIf="selectedItem()" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
          <button (click)="selectedItem.set(null)" class="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
          <h3 class="text-base font-bold text-white">Update Lead Status</h3>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1">Status</label>
              <select [(ngModel)]="newStatus" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white">
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1">Admin Remarks</label>
              <textarea [(ngModel)]="adminRemarks" rows="3" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" placeholder="Add engineering quotation notes..."></textarea>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button (click)="selectedItem.set(null)" class="px-3 py-1.5 text-xs text-slate-400">Cancel</button>
            <button (click)="saveStatus()" class="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg">Save Status</button>
          </div>
        </div>
      </div>
    </div>
  \`
})
export class AdminInquiriesComponent implements OnInit {
  private reqService = inject(RequirementService);
  private toast = inject(ToastService);

  items = signal<ClientRequirement[]>([]);
  search = '';
  statusFilter = 'All';

  selectedItem = signal<ClientRequirement | null>(null);
  newStatus: RequirementStatus = 'Contacted';
  adminRemarks = '';

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.reqService.getAdminRequirements(1, 50, this.statusFilter, this.search).subscribe(res => {
      if (res.success && res.data) this.items.set(res.data.items);
    });
  }

  openStatusModal(item: ClientRequirement): void {
    this.selectedItem.set(item);
    this.newStatus = item.status;
    this.adminRemarks = item.adminRemarks || '';
  }

  saveStatus(): void {
    const item = this.selectedItem();
    if (!item) return;

    this.reqService.updateStatus(item.requirementId, { status: this.newStatus, adminRemarks: this.adminRemarks }).subscribe({
      next: res => {
        this.toast.success('Lead status updated.');
        this.selectedItem.set(null);
        this.loadData();
      }
    });
  }
}
`
  },
  {
    path: 'src/app/features/admin/products/admin-products.component.ts',
    name: 'admin-products.component.ts',
    category: 'Admin Panel',
    language: 'typescript',
    description: 'Product management with status toggling and creation',
    content: `import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { ToastService } from '../../../core/services/toast.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: \`
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Product Catalog Management</h1>
          <p class="text-xs text-slate-400 mt-1">Manage industrial polymer lines and active statuses</p>
        </div>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th class="p-3">Product Name</th>
              <th class="p-3">Category</th>
              <th class="p-3">Specifications</th>
              <th class="p-3">Status</th>
              <th class="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr *ngFor="let p of products()">
              <td class="p-3 font-semibold text-white">{{ p.productName }}</td>
              <td class="p-3 text-slate-400">{{ p.category?.categoryName }}</td>
              <td class="p-3 max-w-xs truncate text-slate-400">{{ p.specifications }}</td>
              <td class="p-3">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold"
                  [ngClass]="p.isActive ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'">
                  {{ p.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="p-3 text-right space-x-2">
                <button (click)="toggleStatus(p.productId)" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300">
                  Toggle
                </button>
                <button (click)="deleteProduct(p.productId)" class="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  \`
})
export class AdminProductsComponent implements OnInit {
  private prodService = inject(ProductService);
  private toast = inject(ToastService);

  products = signal<Product[]>([]);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.prodService.getProducts(1, 50).subscribe(res => {
      if (res.success && res.data) this.products.set(res.data.items);
    });
  }

  toggleStatus(id: number): void {
    this.prodService.toggleProductStatus(id).subscribe(res => {
      this.toast.success('Product status toggled.');
      this.loadProducts();
    });
  }

  deleteProduct(id: number): void {
    if (!confirm('Are you sure you want to delete this product?')) return;
    this.prodService.deleteProduct(id).subscribe(res => {
      this.toast.success('Product removed.');
      this.loadProducts();
    });
  }
}
`
  },
  {
    path: 'src/app/features/admin/users/admin-users.component.ts',
    name: 'admin-users.component.ts',
    category: 'Admin Panel',
    language: 'typescript',
    description: 'SuperAdmin user CRUD management with status toggle and role guards',
    content: `import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminUserService } from '../../../core/services/admin-user.service';
import { ToastService } from '../../../core/services/toast.service';
import { AdminUser, CreateAdminRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: \`
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">System Administrators Management</h1>
          <p class="text-xs text-slate-400 mt-1">SuperAdmin exclusive panel: Add, deactivate, and manage roles</p>
        </div>
        <button (click)="showCreateModal.set(true)" class="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs">
          + Add Administrator
        </button>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th class="p-3">Administrator</th>
              <th class="p-3">Email</th>
              <th class="p-3">Role</th>
              <th class="p-3">Status</th>
              <th class="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr *ngFor="let u of users()">
              <td class="p-3 font-semibold text-white">{{ u.fullName }}</td>
              <td class="p-3 text-slate-400 font-mono">{{ u.email }}</td>
              <td class="p-3">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold"
                  [ngClass]="u.role === 'SuperAdmin' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-blue-950 text-blue-400 border border-blue-800'">
                  {{ u.role }}
                </span>
              </td>
              <td class="p-3">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold"
                  [ngClass]="u.isActive ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'">
                  {{ u.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="p-3 text-right space-x-2">
                <button (click)="toggleStatus(u.adminId)" class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300">
                  Toggle Status
                </button>
                <button (click)="deleteUser(u.adminId)" class="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add Administrator Modal -->
      <div *ngIf="showCreateModal()" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
          <button (click)="showCreateModal.set(false)" class="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
          <h3 class="text-base font-bold text-white">Create New Administrator</h3>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
              <input type="text" [(ngModel)]="newFullName" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1">Email</label>
              <input type="email" [(ngModel)]="newEmail" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1">Password</label>
              <input type="password" [(ngModel)]="newPassword" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-400 mb-1">Role</label>
              <select [(ngModel)]="newRole" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white">
                <option value="Admin">Admin</option>
                <option value="SuperAdmin">SuperAdmin</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button (click)="showCreateModal.set(false)" class="px-3 py-1.5 text-xs text-slate-400">Cancel</button>
            <button (click)="createAdmin()" class="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg">Create</button>
          </div>
        </div>
      </div>
    </div>
  \`
})
export class AdminUsersComponent implements OnInit {
  private userService = inject(AdminUserService);
  private toast = inject(ToastService);

  users = signal<AdminUser[]>([]);
  showCreateModal = signal(false);

  newFullName = '';
  newEmail = '';
  newPassword = '';
  newRole: 'SuperAdmin' | 'Admin' = 'Admin';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers(1, 50).subscribe(res => {
      if (res.success && res.data) this.users.set(res.data.items);
    });
  }

  toggleStatus(id: number): void {
    this.userService.toggleUserStatus(id).subscribe({
      next: () => {
        this.toast.success('Admin status toggled.');
        this.loadUsers();
      }
    });
  }

  deleteUser(id: number): void {
    if (!confirm('Are you sure you want to delete this administrator?')) return;
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.toast.success('Administrator deleted.');
        this.loadUsers();
      }
    });
  }

  createAdmin(): void {
    if (!this.newFullName || !this.newEmail || !this.newPassword) {
      this.toast.error('All fields are mandatory.');
      return;
    }

    this.userService.createUser({
      fullName: this.newFullName,
      email: this.newEmail,
      password: this.newPassword,
      role: this.newRole
    }).subscribe({
      next: () => {
        this.toast.success('Administrator created.');
        this.showCreateModal.set(false);
        this.newFullName = '';
        this.newEmail = '';
        this.newPassword = '';
        this.loadUsers();
      }
    });
  }
}
`
  },
  {
    path: 'src/app/features/admin/company/admin-company.component.ts',
    name: 'admin-company.component.ts',
    category: 'Admin Panel',
    language: 'typescript',
    description: 'Company settings editor managing phone, address, and WhatsApp parameters',
    content: `import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompanyService } from '../../../core/services/company.service';
import { ToastService } from '../../../core/services/toast.service';
import { CompanySettings } from '../../../core/models/company.model';

@Component({
  selector: 'app-admin-company',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: \`
    <div class="space-y-6 max-w-3xl">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Company Profile & WhatsApp Settings</h1>
        <p class="text-xs text-slate-400 mt-1">Configure company metadata and direct WhatsApp inquiry number</p>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4" *ngIf="settings()">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-400 mb-1">Company Name</label>
            <input type="text" [(ngModel)]="companyName" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-400 mb-1">WhatsApp Phone Number</label>
            <input type="text" [(ngModel)]="whatsAppNumber" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-400 mb-1">Phone Contact</label>
            <input type="text" [(ngModel)]="phoneContact" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-400 mb-1">Email Contact</label>
            <input type="email" [(ngModel)]="emailContact" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-400 mb-1">Factory Address</label>
          <input type="text" [(ngModel)]="address" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white" />
        </div>

        <button (click)="saveSettings()" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  \`
})
export class AdminCompanyComponent implements OnInit {
  private compService = inject(CompanyService);
  private toast = inject(ToastService);

  settings = signal<CompanySettings | null>(null);

  companyName = '';
  whatsAppNumber = '';
  phoneContact = '';
  emailContact = '';
  address = '';

  ngOnInit(): void {
    this.compService.getCompanySettings().subscribe(res => {
      if (res.success && res.data) {
        this.settings.set(res.data);
        this.companyName = res.data.companyName;
        this.whatsAppNumber = res.data.whatsAppNumber;
        this.phoneContact = res.data.phoneContact;
        this.emailContact = res.data.emailContact;
        this.address = res.data.address;
      }
    });
  }

  saveSettings(): void {
    this.compService.updateCompanySettings({
      companyName: this.companyName,
      whatsAppNumber: this.whatsAppNumber,
      phoneContact: this.phoneContact,
      emailContact: this.emailContact,
      address: this.address
    }).subscribe({
      next: () => this.toast.success('Company settings updated.')
    });
  }
}
`
  },

  // ==========================================
  // 9. AUTH FEATURES
  // ==========================================
  {
    path: 'src/app/features/auth/login/login.component.ts',
    name: 'login.component.ts',
    category: 'Auth',
    language: 'typescript',
    description: 'Reactive login form handling Bearer JWT authentication and rate limiting',
    content: `import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: \`
    <div class="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
      <div class="text-center">
        <div class="w-12 h-12 rounded-2xl bg-blue-600 mx-auto flex items-center justify-center text-xl font-bold mb-3 shadow-lg">
          OM
        </div>
        <h1 class="text-xl font-bold text-white">Administrator Sign In</h1>
        <p class="text-xs text-slate-400 mt-1">OM Polymer Management Portal</p>
      </div>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
          <input formControlName="email" type="email" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white" />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Password</label>
          <input formControlName="password" type="password" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white" />
        </div>

        <div class="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-0.5">
          <div class="font-semibold text-slate-300">Seed Administrative Credentials:</div>
          <div>Email: <span class="text-blue-400 font-mono">admin@ompolymer.com</span></div>
          <div>Password: <span class="text-blue-400 font-mono">Admin@123</span></div>
        </div>

        <button 
          type="submit" 
          [disabled]="loading()"
          class="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md transition-colors disabled:opacity-50"
        >
          {{ loading() ? 'Authenticating & Issuing Token...' : 'Authenticate & Enter' }}
        </button>
      </form>
    </div>
  \`
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  loading = signal(false);

  loginForm: FormGroup = this.fb.group({
    email: ['admin@ompolymer.com', [Validators.required, Validators.email]],
    password: ['Admin@123', Validators.required]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading.set(true);
    this.auth.login(this.loginForm.value).subscribe({
      next: res => {
        this.loading.set(false);
        this.toast.success(\`Welcome back, \${res.data.fullName}!\`);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: () => this.loading.set(false)
    });
  }
}
`
  },
  {
    path: 'src/app/features/auth/forgot-password/forgot-password.component.ts',
    name: 'forgot-password.component.ts',
    category: 'Auth',
    language: 'typescript',
    description: 'Forgot password component respecting backend rate limits',
    content: `import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: \`
    <div class="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
      <div class="text-center">
        <h1 class="text-xl font-bold text-white">Reset Administrative Password</h1>
        <p class="text-xs text-slate-400 mt-1">Dispatches a 1-hour secure password reset token</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Registered Administrator Email</label>
          <input formControlName="email" type="email" class="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white" />
        </div>

        <button type="submit" [disabled]="loading()" class="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-colors disabled:opacity-50">
          {{ loading() ? 'Sending...' : 'Dispatch Reset Token' }}
        </button>
      </form>
    </div>
  \`
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  loading = signal(false);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.http.post<any>(\`\${environment.apiUrl}/admin/auth/forgot-password\`, this.form.value).subscribe({
      next: res => {
        this.loading.set(false);
        this.toast.success(res.message);
      },
      error: () => this.loading.set(false)
    });
  }
}
`
  },

  // ==========================================
  // 10. SHARED & SHELL
  // ==========================================
  {
    path: 'src/app/shared/components/toast.component.ts',
    name: 'toast.component.ts',
    category: 'Shared & Shell',
    language: 'typescript',
    description: 'Global standalone toast notification banner component',
    content: `import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <div 
        *ngFor="let toast of toastService.messages()" 
        class="pointer-events-auto p-3.5 rounded-xl shadow-xl border text-xs flex items-start gap-3 transition-all"
        [ngClass]="{
          'bg-emerald-950/95 border-emerald-700 text-emerald-200': toast.type === 'success',
          'bg-rose-950/95 border-rose-700 text-rose-200': toast.type === 'error',
          'bg-blue-950/95 border-blue-700 text-blue-200': toast.type === 'info',
          'bg-amber-950/95 border-amber-700 text-amber-200': toast.type === 'warning'
        }"
      >
        <div class="text-base shrink-0">
          <span *ngIf="toast.type === 'success'">✅</span>
          <span *ngIf="toast.type === 'error'">⚠️</span>
          <span *ngIf="toast.type === 'info'">ℹ️</span>
          <span *ngIf="toast.type === 'warning'">⚡</span>
        </div>
        <div class="flex-1">
          <div *ngIf="toast.title" class="font-bold text-white mb-0.5">{{ toast.title }}</div>
          <div>{{ toast.message }}</div>
        </div>
        <button 
          (click)="toastService.remove(toast.id)"
          class="text-white/60 hover:text-white font-bold p-0.5 ml-1"
        >
          ✕
        </button>
      </div>
    </div>
  \`
})
export class ToastComponent {
  toastService = inject(ToastService);
}
`
  },
  {
    path: 'src/app/app.routes.ts',
    name: 'app.routes.ts',
    category: 'Shared & Shell',
    language: 'typescript',
    description: 'Centralized role-based routing structure connecting User, Public and Admin layouts',
    content: `import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { superAdminGuard } from './core/guards/role.guard';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';

export const routes: Routes = [
  // 1. USER INTERFACE (Public Client Portal)
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {
        path: '',
        title: 'OM POLYMER | Industrial Extrusion & Polymer Engineering',
        loadComponent: () => import('./features/user/home/user-home.component')
          .then(m => m.UserHomeComponent)
      },
      {
        path: 'products',
        title: 'OM POLYMER | Products Catalog',
        loadComponent: () => import('./features/user/catalog/product-catalog.component')
          .then(m => m.ProductCatalogComponent)
      },
      {
        path: 'products/:slug',
        title: 'OM POLYMER | Technical Specifications',
        loadComponent: () => import('./features/user/product-detail/product-detail.component')
          .then(m => m.ProductDetailComponent)
      },
      {
        path: 'quote',
        title: 'OM POLYMER | Technical Quotation Request (RFQ)',
        loadComponent: () => import('./features/user/rfq/user-rfq.component')
          .then(m => m.UserRfqComponent)
      },
      {
        path: 'maintenance',
        title: 'OM POLYMER | Maintenance Reference',
        loadComponent: () => import('./features/user/maintenance-ref/maintenance-ref.component')
          .then(m => m.MaintenanceRefComponent)
      }
    ]
  },

  // 2. AUTHENTICATION (Public Layout)
  {
    path: 'auth',
    component: PublicLayoutComponent,
    children: [
      {
        path: 'login',
        title: 'OM POLYMER | Administrator Sign In',
        loadComponent: () => import('./features/auth/login/login.component')
          .then(m => m.LoginComponent)
      },
      {
        path: 'forgot-password',
        title: 'OM POLYMER | Password Recovery',
        loadComponent: () => import('./features/auth/forgot-password/forgot-password.component')
          .then(m => m.ForgotPasswordComponent)
      }
    ]
  },

  // 3. ADMIN PANEL (Protected Role-Based Layout)
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        title: 'Admin Console | Dashboard',
        loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component')
          .then(m => m.AdminDashboardComponent)
      },
      {
        path: 'inquiries',
        title: 'Admin Console | Inquiries CRM',
        loadComponent: () => import('./features/admin/inquiries/admin-inquiries.component')
          .then(m => m.AdminInquiriesComponent)
      },
      {
        path: 'products',
        title: 'Admin Console | Product Management',
        loadComponent: () => import('./features/admin/products/admin-products.component')
          .then(m => m.AdminProductsComponent)
      },
      {
        path: 'company',
        title: 'Admin Console | Company Settings',
        loadComponent: () => import('./features/admin/company/admin-company.component')
          .then(m => m.AdminCompanyComponent)
      },
      // SuperAdmin Exclusive Route
      {
        path: 'users',
        title: 'Admin Console | System Administrators',
        canActivate: [superAdminGuard],
        loadComponent: () => import('./features/admin/users/admin-users.component')
          .then(m => m.AdminUsersComponent)
      }
    ]
  },

  { path: '**', redirectTo: '' }
];
`
  },
  {
    path: 'src/app/app.config.ts',
    name: 'app.config.ts',
    category: 'Shared & Shell',
    language: 'typescript',
    description: 'Angular providers, Router and functional HTTP interceptors',
    content: `import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, errorInterceptor])
    )
  ]
};
`
  },
  {
    path: 'src/app/app.component.ts',
    name: 'app.component.ts',
    category: 'Shared & Shell',
    language: 'typescript',
    description: 'Root Angular component hosting RouterOutlet and ToastNotifications',
    content: `import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  template: \`
    <div class="min-h-screen">
      <router-outlet></router-outlet>
      <app-toast></app-toast>
    </div>
  \`
})
export class AppComponent {
  private themeService = inject(ThemeService);
}
`
  },

  // ==========================================
  // 11. UNIT TESTS
  // ==========================================
  {
    path: 'src/app/core/services/auth.service.spec.ts',
    name: 'auth.service.spec.ts',
    category: 'Unit Tests',
    language: 'typescript',
    description: 'Unit test suite verifying AuthService login, token persistence and logout',
    content: `import { TestBed } from '@angular/core/testing';
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

    const req = httpTesting.expectOne(\`\${environment.apiUrl}\${API_ENDPOINTS.AUTH.LOGIN}\`);
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
`
  },
  {
    path: 'src/app/core/guards/auth.guard.spec.ts',
    name: 'auth.guard.spec.ts',
    category: 'Unit Tests',
    language: 'typescript',
    description: 'Unit test suite for route protection and login redirection',
    content: `import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  it('should allow access when authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, { url: '/admin/dashboard' } as RouterStateSnapshot)
    );
    expect(result).toBeTrue();
  });
});
`
  },
  {
    path: 'src/app/core/interceptors/auth.interceptor.spec.ts',
    name: 'auth.interceptor.spec.ts',
    category: 'Unit Tests',
    language: 'typescript',
    description: 'Unit test suite verifying selective Authorization Bearer injection',
    content: `import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should attach Bearer header to /api/admin requests', () => {
    authService.token.set('valid-test-jwt');

    http.get('/api/admin/requirements').subscribe();

    const req = httpTesting.expectOne('/api/admin/requirements');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer valid-test-jwt');
    req.flush({ success: true, data: [] });
  });

  it('should not attach Authorization header for public customer endpoints', () => {
    authService.token.set('valid-test-jwt');

    http.get('/api/products').subscribe();

    const req = httpTesting.expectOne('/api/products');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({ success: true, data: [] });
  });
});
`
  },

  // ==========================================
  // 12. DOCUMENTATION
  // ==========================================
  {
    path: 'README.md',
    name: 'README.md',
    category: 'Documentation',
    language: 'markdown',
    description: 'Installation, CLI execution, role hierarchy and architecture guide',
    content: `# OM Polymer — Angular 19 Production Frontend Application

## Single Application with Two Role-Based Experiences
1. **User Client Portal (\`/\`)**:
   - Modern corporate landing page with engineering capabilities & stats.
   - Products catalog with category filtering and keyword search.
   - Product detail specification sheets with ISO standard tags.
   - Client technical requirement (RFQ) submission form with backend validation and rate limit protection.
   - Maintenance reference page with animated laptop, floating technician, and interactive contact cards.
   - Dynamic Light / Dark mode toggling.

2. **Admin Panel (\`/admin\`)**:
   - Protected layout with sidebar navigation, role indicator, and logout.
   - Admin KPI Dashboard with lead counters and recent inquiries.
   - Client Inquiries & Leads CRM with search, status filtering, and remarks update.
   - Product Catalog CRUD & active status toggling.
   - Company Settings and WhatsApp phone configuration.
   - **SuperAdmin Exclusive Area (\`/admin/users\`)**: Administrator management and role assignments.

---

## Prerequisites
- **Node.js**: v18.19.0 or v20.x+ LTS
- **Angular CLI**: v19.x (\`npm install -g @angular/cli\`)

---

## Quick Start
\`\`\`bash
cd om-polymer-angular
npm install
npm start
\`\`\`
The application will launch on \`http://localhost:4200/\` and proxy all \`/api/*\` calls to your ASP.NET Core API server on \`http://localhost:5000\`.

---

## Run Unit Tests
\`\`\`bash
npm test
\`\`\`

---

## Production Build
\`\`\`bash
npm run build
\`\`\`
Output directory: \`dist/om-polymer-angular/browser\`
`
  }
];
