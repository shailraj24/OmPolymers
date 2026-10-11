# OM Polymer — ASP.NET Core 10 Web API Backend

Production-grade, Enterprise-ready Web API backend for OM Polymer, built with:
- **.NET 10 LTS Web API**
- **Entity Framework Core (Database First)**
- **SQL Server Database**
- **JWT Bearer Authentication** with role-based policies (`SuperAdmin`, `Admin`)
- **BCrypt Password Hashing**
- **Rate Limiting Policies** (`LoginPolicy`, `RequirementPolicy`, `ForgotPasswordPolicy`)
- **Swagger / OpenAPI Documentation**
- **xUnit & Moq Unit Test Suite**

---

## Repository Structure

```
├── OMPolymer.sln
├── OMPolymer.API/
│   ├── OMPolymer.API.csproj
│   ├── Program.cs
│   ├── appsettings.json
│   ├── Controllers/
│   │   ├── CompanyController.cs
│   │   ├── ProductsController.cs
│   │   ├── RequirementsController.cs
│   │   ├── AuthController.cs
│   │   ├── UsersController.cs
│   │   ├── BlogsController.cs
│   │   ├── TestimonialsController.cs
│   │   └── UploadsController.cs
│   ├── Data/
│   │   ├── OMPolymerDbContext.cs
│   │   └── Models/
│   ├── DTOs/
│   ├── Services/
│   ├── Middleware/
│   └── Common/
├── OMPolymer.Tests/
│   ├── OMPolymer.Tests.csproj
│   └── Services/
└── Database/
    ├── OMPolymerDB.sql
    └── SeedData.sql
```

---

## Quick Start Instructions

### 1. Prerequisites
- **.NET 10 SDK** (or .NET 8/9 LTS): `dotnet --version`
- **Microsoft SQL Server** (Developer Edition, Express, or LocalDB)
- **SSMS** or Azure Data Studio

### 2. Database Setup
1. Open SQL Server Management Studio (SSMS).
2. Connect to your SQL Server instance.
3. Open and execute `Database/OMPolymerDB.sql`.
4. Optionally run `Database/SeedData.sql` for pre-populated demo data.

### 3. Configure Connection String
Open `OMPolymer.API/appsettings.json` and verify `DefaultConnection`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=OMPolymerDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true;"
}
```

### 4. Run the API
```bash
cd OMPolymer.API
dotnet restore
dotnet run
```

API will be accessible at:
- Swagger UI: `https://localhost:7001/swagger` or `http://localhost:5000/swagger`

### 5. Run Unit Tests
```bash
dotnet test
```

---

## Seed Administrative Credentials
- **Email**: `admin@ompolymer.com`
- **Password**: `Admin@123`
- **Role**: `SuperAdmin`
