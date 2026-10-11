# OM Polymer — Angular 19 Production Frontend Application

## Single Application with Two Role-Based Experiences
1. **User Client Portal (`/`)**:
   - Modern corporate landing page with engineering capabilities & stats.
   - Products catalog with category filtering and keyword search.
   - Product detail specification sheets with ISO standard tags.
   - Client technical requirement (RFQ) submission form with backend validation and rate limit protection.
   - Maintenance reference page with animated laptop, floating technician, and interactive contact cards.
   - Dynamic Light / Dark mode toggling.

2. **Admin Panel (`/admin`)**:
   - Protected layout with sidebar navigation, role indicator, and logout.
   - Admin KPI Dashboard with lead counters and recent inquiries.
   - Client Inquiries & Leads CRM with search, status filtering, and remarks update.
   - Product Catalog CRUD & active status toggling.
   - Company Settings and WhatsApp phone configuration.
   - **SuperAdmin Exclusive Area (`/admin/users`)**: Administrator management and role assignments.

---

## Prerequisites
- **Node.js**: v18.19.0 or v20.x+ LTS
- **Angular CLI**: v19.x (`npm install -g @angular/cli`)

---

## Quick Start
```bash
cd om-polymer-angular
npm install
npm start
```
The application will launch on `http://localhost:4200/` and proxy all `/api/*` calls to your ASP.NET Core API server on `http://localhost:5000`.

---

## Run Unit Tests
```bash
npm test
```

---

## Production Build
```bash
npm run build
```
Output directory: `dist/om-polymer-angular/browser`
