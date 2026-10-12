import { Routes } from '@angular/router';
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
        path: 'blogs',
        title: 'OM POLYMER | Engineering Articles & Insights',
        loadComponent: () => import('./features/user/blogs/blog-list.component')
          .then(m => m.BlogListComponent)
      },
      {
        path: 'blogs/:slug',
        title: 'OM POLYMER | Article Specification',
        loadComponent: () => import('./features/user/blogs/blog-detail.component')
          .then(m => m.BlogDetailComponent)
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
        path: 'blogs',
        title: 'Admin Console | Articles & Blogs',
        loadComponent: () => import('./features/admin/blogs/admin-blogs.component')
          .then(m => m.AdminBlogsComponent)
      },
      {
        path: 'logs',
        title: 'Admin Console | System Logs',
        loadComponent: () => import('./features/admin/logs/admin-logs.component')
          .then(m => m.AdminLogsComponent)
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
