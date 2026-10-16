# OM Polymer Enhancement & Refactoring Plan

A comprehensive engineering plan to introduce a movable floating WhatsApp action, remove blog category dependencies, establish full dynamic product category CRUD across the stack, integrate categories into public and admin product workflows, remove manual slug configuration in favor of automatic backend slug generation, and provide safe EF Core database schema migrations.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions have been confirmed through user feedback and will govern execution:

- **Confirmed Decision 1 (Slug Strategy)**: Manual URL slug input fields will be completely removed from all admin forms (Products, Blogs, Categories). Slugs will be automatically generated behind the scenes in the backend from the name or title to maintain SEO-friendly routing and URL backward compatibility without requiring administrator intervention.
- **Confirmed Decision 2 (Category Deletion Guard)**: Product category deletion will strictly block deletion if any products are currently assigned to the category, presenting a clear explanatory alert to prevent accidental data loss or orphaned product records.
- **Confirmed Decision 3 (Movable WhatsApp Button)**: The floating WhatsApp button will default to the bottom-right corner, remain constrained to the viewport on mobile and desktop, distinguish between dragging and clicking (5px threshold), and persist user repositioning in `localStorage`.

---

## 1. Overview & Core Concept

- **What It Does**: Upgrades OM Polymer's web platform to eliminate rigid static product categories in favor of full dynamic category management; streamlines blog publishing by removing obsolete category requirements; improves user contact flexibility with an intuitive draggable floating WhatsApp icon; removes administrative slug friction with automated SEO slugging; and keeps both Angular 19 and ASP.NET Core 10 codebases in clean synchronization.
- **Target Audience**: Corporate plant buyers, industrial engineering leads, municipal project managers, and internal OM Polymer system administrators.
- **Key Value**: Fluid administrative experience without manual slug errors, complete category governance, and uninterrupted customer inquiry pathways.

---

## 2. User Experience & Visual Design

### A. Movable WhatsApp Floating Button
- **Desktop & Mobile Interaction**:
  - Pointer/touch dragging using standard Pointer Events (`pointerdown`, `pointermove`, `pointerup`).
  - Movement threshold: dragging distance $< 5\text{px}$ is treated as an intentional click/tap that opens the WhatsApp chat link (`https://wa.me/...`). Movements $\ge 5\text{px}$ reposition the widget without triggering navigation.
  - Viewport boundary clamping (`Math.max` and `Math.min`) to prevent the button from slipping off-screen during drag or on viewport resize/orientation change.
  - Default resting position: 24px from bottom, 24px from right (`bottom: 24px, right: 24px`).
  - Position persistence via `localStorage` key `om_whatsapp_pos`.
  - Accessible tooltip and `aria-label="Contact OM Polymer on WhatsApp"`.

### B. Dynamic Product Category Management (Admin CRUD)
- **Navigation**: Dedicated "Categories" tab in Admin Navigation between "Products" and "Blogs".
- **Category Table**:
  - Displays Category Name, Description, Associated Product Count, Status (Active / Inactive), and Action buttons (Edit, Toggle Status, Delete).
  - Empty state with clear prompt when no categories exist.
- **Add / Edit Modal**:
  - Clean inputs: Category Name (required), Description (optional, textarea), Active checkbox.
  - No slug input field (slug is generated automatically).
- **Deletion Safety**:
  - When clicking "Delete", checks associated product count.
  - If product count $> 0$, presents a blocker warning: *"Cannot delete category. This category currently has X associated products. Reassign or remove these products before deleting."*
  - If product count $== 0$, displays standard confirmation dialog before deletion.

### C. Streamlined Blog Management (No Categories)
- **Admin Blog Forms**:
  - Completely removed Blog Category dropdown and validation from both Add and Edit modals.
  - Form focuses on Title, Short Description, Rich Content, Featured Image, Author, and Published status.
  - Removed manual slug input (slug generated from Title automatically).
- **Public & Admin Blog Listings**:
  - Removed category badges, category filter dropdowns, and category routing tags.
  - Clean publication metadata: Author · Published Date · Read Time.

### D. Dynamic Product Integration
- **Admin Product Forms**:
  - Category selector dynamically loaded from `/api/admin/categories` or `/api/products/categories`.
  - Displays only valid active categories when creating products, while preserving existing assigned category when editing.
  - Removed manual slug input from product form.
- **Public Product Catalog**:
  - Dynamic filter pills/tabs derived from live active categories in the database.
  - Products display their dynamic category name cleanly.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Automatic Backend Slug Generation**:
  - *Chosen Approach*: Generate clean URL slugs from titles/names server-side (e.g. `Regex.Replace(title.ToLowerInvariant(), @"[^a-z0-9\s-]", "")`) while ensuring uniqueness with numerical suffix collision resolution.
  - *Why*: Eliminates administrative human error, invalid character entry, and redundant form fields, while preserving existing slug-based routes like `/products/:slug` and `/blogs/:slug`.
- **Decision 2: Safe Foreign Key Deletion Behavior**:
  - *Chosen Approach*: Configure Entity Framework Core with `DeleteBehavior.Restrict` on `Product.CategoryId -> ProductCategory.CategoryId`.
  - *Why*: Prevents catastrophic cascading deletes of industrial product catalogs if an admin deletes a category.
- **Decision 3: Dual-Sync for Angular 19 and Full-Stack Environment**:
  - *Chosen Approach*: Implement updates across both the Angular codebase (`/angular/src/app/...`) and the Express/React dev environment (`src/components/...` and `src/server/...`) and .NET 10 solution (`/dotnet/...`).
  - *Why*: Guarantees that both standalone Angular build exports and the live development server are immediately verified and production-ready.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        User & Admin UI Layer                           │
│  ┌───────────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │  Movable WhatsApp     │  │  Product Catalog │  │  Admin Category  │ │
│  │  Pointer Drag Widget  │  │  & Blog Views    │  │  & Product CRUD  │ │
│  └───────────┬───────────┘  └─────────┬────────┘  └─────────┬────────┘ │
└──────────────┼────────────────────────┼─────────────────────┼──────────┘
               │                        │                     │
               ▼                        ▼                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       Frontend Services (Angular)                      │
│      category.service.ts  ·  product.service.ts  ·  blog.service.ts    │
└───────────────────────────────────────┬────────────────────────────────┘
                                        │ HTTP REST Requests
                                        ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  ASP.NET Core 10 Web API / Express                     │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  AdminCategoriesController (GET, POST, PUT, DELETE, Toggle)      │  │
│  │  AutoSlugGenerator Service (Title/Name -> Slug)                  │  │
│  │  AdminProductsController / ProductsController (Dynamic Category) │  │
│  │  AdminBlogsController / BlogsController (Categories Removed)     │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
└─────────────────────────────────────┼──────────────────────────────────┘
                                      │ EF Core / LINQ
                                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       SQL Server / Database Layer                      │
│  ┌───────────────────────────┐         ┌────────────────────────────┐  │
│  │   ProductCategories       │ 1     * │          Products          │  │
│  │   CategoryId (PK)         │─────────┤   ProductId (PK)           │  │
│  │   CategoryName, Desc      │         │   CategoryId (FK - Restrict│  │
│  │   IsActive, Created/Update│         │   ProductName, Desc, etc.  │  │
│  └───────────────────────────┘         └────────────────────────────┘  │
│                                                                        │
│  ┌───────────────────────────┐                                         │
│  │          BlogPosts        │ (BlogCategoryId foreign key removed /   │
│  │   BlogId, Title, Content  │  made nullable; manual slug removed     │
│  │   Author, IsPublished...  │  from input DTOs)                       │
│  └───────────────────────────┘                                         │
└────────────────────────────────────────────────────────────────────────┘
```

### Affected Files & Scope
1. **Movable WhatsApp Button**:
   - `/angular/src/app/shared/components/draggable-whatsapp/draggable-whatsapp.component.ts` (new standalone Angular component)
   - `/angular/src/app/layouts/user-layout/user-layout.component.ts` (embed draggable component)
   - `/src/components/DraggableWhatsApp.tsx` and `/src/components/AngularPortal.tsx` (simulator sync)
2. **Dynamic Product Categories**:
   - `/dotnet/OMPolymer.API/DTOs/CategoryDTOs.cs` (CategoryResponseDto, CreateCategoryDto, UpdateCategoryDto)
   - `/dotnet/OMPolymer.API/Controllers/AdminCategoriesController.cs` (full Admin CRUD endpoints with duplicate check and product count check)
   - `/angular/src/app/core/services/category.service.ts` (Angular service for categories)
   - `/angular/src/app/features/admin/categories/admin-categories.component.ts` (Admin Category management UI)
   - `/angular/src/app/app.routes.ts` (add admin/categories route)
   - `/src/server/routes.ts` (ensure full CRUD endpoints in dev server)
3. **Blog Category Removal**:
   - `/dotnet/OMPolymer.API/DTOs/BlogDTOs.cs` (remove category fields from Create/Update DTOs)
   - `/dotnet/OMPolymer.API/Controllers/AdminBlogsController.cs` and `BlogsController.cs` (remove category mapping/filtering)
   - `/angular/src/app/features/admin/blogs/admin-blogs.component.ts` (remove category inputs from form and table)
   - `/angular/src/app/features/user/blogs/blog-list/blog-list.component.ts` and `blog-detail.component.ts` (remove category badges and filters)
4. **Remove URL Slug Fields**:
   - Remove slug form controls from Admin Products (`admin-products.component.ts`), Blogs (`admin-blogs.component.ts`), and Categories.
   - Implement backend slug helper to automatically generate slug from product name or blog title.
5. **Database & EF Core Migrations**:
   - Migration updating `ProductCategory` with `Description`, `CreatedAt`, `UpdatedAt`.
   - Update `Product` to `ProductCategory` relation with `Restrict` on delete.
   - Remove or decouple `BlogCategoryId` from `BlogPost`.
