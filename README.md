# OM Polymer — Enterprise Industrial Manufacturing & Polymer Engineering

Production-ready industrial platform featuring:
- **Angular 19 Standalone Frontend** (`angular/`)
- **ASP.NET Core 10 Web API Backend** (`dotnet/OMPolymer.API/`)
- **Full-Stack Node.js / Express / Vite Simulator** (`server.ts` & `src/`)

---

## 🚀 Quick Start Guide (Local Setup)

### Option 1: Running the Angular 19 Application
```bash
# 1. Navigate to the angular directory
cd angular

# 2. Install dependencies
npm install

# 3. Start development server
npm start
# or: npx ng serve --port 4200
```
Open **http://localhost:4200** in your browser.

> **Features in Angular 19:**
> - Modern industrial homepage with hero showcase, engineering metrics, product highlights, dynamic articles, and WhatsApp direct consultation.
> - Product Catalog with category filtering, search, and detailed technical specifications.
> - Engineering Blogs with full category filtering, live search, and detail reader view.
> - RFQ Quotation Engine for lead capture.
> - Admin Panel (`/admin`) with full CRUD for Products, Articles/Blogs, and dynamic server Logs viewer.

---

### Option 2: Running the ASP.NET Core 10 Web API
```bash
# 1. Navigate to the .NET API directory
cd dotnet/OMPolymer.API

# 2. Restore packages and run
dotnet restore
dotnet run
```
API endpoints will be available at **http://localhost:5000** (Swagger documentation at `/swagger`).

---

### Option 3: Running the Full-Stack Node / Express & Vite Portal
```bash
# 1. From the project root
npm install

# 2. Start the full-stack server
npm run dev
```
Open **http://localhost:3000** in your browser.

---

## 🔄 Why your local UI might not show latest changes & How to fix it:

If you pushed from AI Studio and pulled locally but the UI still looks like the old version:

1. **Pull the latest commit**:
   Make sure you have pulled the latest commit:
   ```bash
   git pull origin main
   ```
   Verify that commit `feat(angular): implement dynamic blogs, product CRUD...` is in your local git history with:
   ```bash
   git log -n 3 --oneline
   ```

2. **Clean build & restart your local dev server**:
   If you have Angular running (`ng serve`):
   - Stop the server (`Ctrl + C`)
   - Re-run `npm install` inside `angular/`
   - Start again with `npm start`

3. **Clear Browser Cache**:
   Browsers aggressively cache CSS and Angular bundle chunks.
   - Chrome / Edge / Firefox: Press `Ctrl + Shift + R` (or `Cmd + Shift + R` on Mac) or `Ctrl + F5`.
   - Alternatively, open DevTools -> Network tab -> check **"Disable cache"** and refresh.

4. **Verify which port you are opening**:
   - Angular 19 runs on: **http://localhost:4200**
   - Node.js / Vite runs on: **http://localhost:3000**
   - ASP.NET Core runs on: **http://localhost:5000**
