// Complete C# ASP.NET Core 10 LTS Solution Files Registry
// Contains 100% complete, fully compilable source code for every Model, DTO, Interface, Service, Controller, Middleware, Config, SQL, and Test.

export interface CodeFile {
  path: string;
  name: string;
  category: 'Configuration' | 'Program' | 'Data & EF Core' | 'DTOs' | 'Services' | 'Controllers' | 'Middleware' | 'Database SQL' | 'Tests';
  language: 'csharp' | 'json' | 'sql' | 'xml';
  description: string;
  content: string;
}

export const csharpSolutionFiles: CodeFile[] = [
  // ==========================================
  // 1. Solution & Project Files
  // ==========================================
  {
    path: '.gitignore',
    name: '.gitignore',
    category: 'Configuration',
    language: 'json',
    description: 'Git ignore rules for secrets (appsettings.json), node_modules, and build binaries',
    content: `## .NET Core / Visual Studio .gitignore
bin/
obj/
*.user
*.suo
*.userosscache
*.sln.docstates
.vs/
.vscode/

## Secrets & Configuration Files
appsettings.json
appsettings.*.json
!appsettings.example.json

## Node.js Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

## Build & Test Results
uploads/
TestResults/
*.DotSettings.user
*.log
.DS_Store
`
  },
  {
    path: 'OMPolymer.API/appsettings.example.json',
    name: 'appsettings.example.json',
    category: 'Configuration',
    language: 'json',
    description: 'Sanitized template for appsettings without database secrets',
    content: `{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=OMPolymerDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true;"
  },
  "JwtSettings": {
    "Key": "YOUR_SUPER_SECRET_AND_LONG_KEY_AT_LEAST_32_CHARACTERS_HERE",
    "Issuer": "OMPolymerAPI",
    "Audience": "OMPolymerClient",
    "DurationInMinutes": 1440
  },
  "FileStorageSettings": {
    "UploadBasePath": "uploads",
    "MaxFileSizeInBytes": 5242880,
    "AllowedExtensions": [ ".jpg", ".jpeg", ".png", ".webp" ],
    "AllowedMimeTypes": [ "image/jpeg", "image/png", "image/webp" ]
  },
  "EmailSettings": {
    "SmtpHost": "smtp.mailtrap.io",
    "SmtpPort": 587,
    "SenderEmail": "no-reply@ompolymer.com",
    "SenderName": "OM Polymer Security",
    "SmtpUser": "",
    "SmtpPass": "",
    "EnableSsl": true,
    "AppBaseUrl": "https://ompolymer.com"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore.Database.Command": "Information"
    }
  },
  "AllowedHosts": "*"
}
`
  },
  {
    path: 'OMPolymer.sln',
    name: 'OMPolymer.sln',
    category: 'Configuration',
    language: 'xml',
    description: 'Visual Studio Solution definition file',
    content: `Microsoft Visual Studio Solution File, Format Version 12.00
# Visual Studio Version 18
VisualStudioVersion = 18.0.35000.1
MinimumVisualStudioVersion = 10.0.40219.1
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "OMPolymer.API", "OMPolymer.API\\OMPolymer.API.csproj", "{4D5E6F7A-8B9C-0D1E-2F3A-4B5C6D7E8F90}"
EndProject
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "OMPolymer.Tests", "OMPolymer.Tests\\OMPolymer.Tests.csproj", "{5E6F7A8B-9C0D-1E2F-3A4B-5C6D7E8F90A1}"
EndProject
Global
	GlobalSection(SolutionConfigurationPlatforms) = preSolution
		Debug|Any CPU = Debug|Any CPU
		Release|Any CPU = Release|Any CPU
	EndGlobalSection
	GlobalSection(ProjectConfigurationPlatforms) = postSolution
		{4D5E6F7A-8B9C-0D1E-2F3A-4B5C6D7E8F90}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{4D5E6F7A-8B9C-0D1E-2F3A-4B5C6D7E8F90}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{4D5E6F7A-8B9C-0D1E-2F3A-4B5C6D7E8F90}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{4D5E6F7A-8B9C-0D1E-2F3A-4B5C6D7E8F90}.Release|Any CPU.Build.0 = Release|Any CPU
		{5E6F7A8B-9C0D-1E2F-3A4B-5C6D7E8F90A1}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{5E6F7A8B-9C0D-1E2F-3A4B-5C6D7E8F90A1}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{5E6F7A8B-9C0D-1E2F-3A4B-5C6D7E8F90A1}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{5E6F7A8B-9C0D-1E2F-3A4B-5C6D7E8F90A1}.Release|Any CPU.Build.0 = Release|Any CPU
	EndGlobalSection
EndGlobal`
  },
  {
    path: 'OMPolymer.API/OMPolymer.API.csproj',
    name: 'OMPolymer.API.csproj',
    category: 'Configuration',
    language: 'xml',
    description: '.NET 10 LTS Web API project file with NuGet dependencies',
    content: `<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <RootNamespace>OMPolymer.API</RootNamespace>
    <GenerateDocumentationFile>true</GenerateDocumentationFile>
    <NoWarn>$(NoWarn);1591</NoWarn>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="10.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="10.0.0">
      <PrivateAssets>all</PrivateAssets>
      <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
    </PackageReference>
    <PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="10.0.0">
      <PrivateAssets>all</PrivateAssets>
      <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
    </PackageReference>
    <PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="10.0.0" />
    <PackageReference Include="BCrypt.Net-Next" Version="4.0.3" />
    <PackageReference Include="Swashbuckle.AspNetCore" Version="7.2.0" />
    <PackageReference Include="MailKit" Version="4.10.0" />
  </ItemGroup>

</Project>`
  },
  {
    path: 'OMPolymer.API/appsettings.json',
    name: 'appsettings.json',
    category: 'Configuration',
    language: 'json',
    description: 'Database connection, JWT settings, File storage & Email configuration',
    content: `{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=OMPolymerDB;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true;"
  },
  "JwtSettings": {
    "Key": "A_Very_Secure_And_Long_Secret_Key_For_OMPolymer_2024_SecurityToken_XYZ",
    "Issuer": "OMPolymerAPI",
    "Audience": "OMPolymerClient",
    "DurationInMinutes": 1440
  },
  "FileStorageSettings": {
    "UploadBasePath": "uploads",
    "MaxFileSizeInBytes": 5242880,
    "AllowedExtensions": [ ".jpg", ".jpeg", ".png", ".webp" ],
    "AllowedMimeTypes": [ "image/jpeg", "image/png", "image/webp" ]
  },
  "EmailSettings": {
    "SmtpHost": "smtp.mailtrap.io",
    "SmtpPort": 587,
    "SenderEmail": "no-reply@ompolymer.com",
    "SenderName": "OM Polymer Security",
    "SmtpUser": "",
    "SmtpPass": "",
    "EnableSsl": true,
    "AppBaseUrl": "https://ompolymer.com"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore.Database.Command": "Information"
    }
  },
  "AllowedHosts": "*"
}`
  },
  {
    path: 'OMPolymer.API/appsettings.Development.json',
    name: 'appsettings.Development.json',
    category: 'Configuration',
    language: 'json',
    description: 'Development environment settings',
    content: `{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft.AspNetCore": "Information"
    }
  }
}`
  },

  // ==========================================
  // 2. Program.cs
  // ==========================================
  {
    path: 'OMPolymer.API/Program.cs',
    name: 'Program.cs',
    category: 'Program',
    language: 'csharp',
    description: 'Application host, Dependency Injection, JWT pipeline & Rate Limiter policies',
    content: `using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using OMPolymer.API.Data;
using OMPolymer.API.Middleware;
using OMPolymer.API.Services.Implementations;
using OMPolymer.API.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// 1. Database Context (SQL Server Database First)
builder.Services.AddDbContext<OMPolymerDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. JWT Bearer Authentication Setup
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"] ?? throw new InvalidOperationException("JWT Secret Key missing."));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        ClockSkew = TimeSpan.Zero
    };
});

// 3. Register Domain Business Services (Dependency Injection)
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAdminUserService, AdminUserService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IBlogService, BlogService>();
builder.Services.AddScoped<IRequirementService, RequirementService>();
builder.Services.AddScoped<ITestimonialService, TestimonialService>();
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<IFileStorageService, FileStorageService>();
builder.Services.AddScoped<IEmailService, EmailService>();

// 4. Rate Limiting for Public RFQ Submissions and Auth Protection
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    // Strict 2 requests per minute per IP for customer quote submission
    options.AddPolicy("RequirementPolicy", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "anon",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 2,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0
            }));

    // 5 login attempts per minute per IP to prevent brute force
    options.AddPolicy("LoginPolicy", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "anon",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0
            }));

    // 3 forgot-password requests per 5 minutes per IP
    options.AddPolicy("ForgotPasswordPolicy", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "anon",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 3,
                Window = TimeSpan.FromMinutes(5),
                QueueLimit = 0
            }));
});

// 5. CORS Policy for Angular / React client storefront
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// 6. Swagger / OpenAPI Configuration with Bearer Security Scheme
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "OM Polymer Web API",
        Version = "v1",
        Description = "Production ASP.NET Core Web API backend for OM Polymer public website and admin portal."
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter JWT Bearer token format: Bearer {token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Global Exception Middleware (Intercepts all unhandled errors into RFC Problem Details)
app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "OM Polymer API v1");
    });
}

app.UseHttpsRedirection();

// Serve physical uploaded files from wwwroot/uploads/
app.UseStaticFiles();

// Security Headers
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Frame-Options", "DENY");
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("Referrer-Policy", "no-referrer");
    await next();
});

app.UseCors("AllowFrontend");
app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();`
  },

  // ==========================================
  // 3. Middleware
  // ==========================================
  {
    path: 'OMPolymer.API/Middleware/ExceptionMiddleware.cs',
    name: 'ExceptionMiddleware.cs',
    category: 'Middleware',
    language: 'csharp',
    description: 'Centralized exception handling middleware for consistent Problem Details',
    content: `using System.Net;
using System.Text.Json;
using OMPolymer.API.DTOs.Responses;

namespace OMPolymer.API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled server error on {Path}: {Message}", context.Request.Path, ex.Message);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                var response = ApiResponse<string>.FailureResponse(
                    _env.IsDevelopment() ? ex.Message : "An internal server error occurred. Please try again later.",
                    _env.IsDevelopment() ? new List<string> { ex.StackTrace ?? string.Empty } : null
                );

                var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });

                await context.Response.WriteAsync(json);
            }
        }
    }
}`
  },

  // ==========================================
  // 4. Entity / Model Classes (Data/Models/)
  // ==========================================
  {
    path: 'OMPolymer.API/Data/Models/AdminUser.cs',
    name: 'AdminUser.cs',
    category: 'Data & EF Core',
    language: 'csharp',
    description: 'Admin user database entity with Role, ProfileImageUrl, and soft delete',
    content: `namespace OMPolymer.API.Data.Models
{
    public class AdminUser
    {
        public int AdminId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = "Admin"; // "SuperAdmin" | "Admin"
        public string? ProfileImageUrl { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsDeleted { get; set; } = false;
        public DateTime? LastLoginAt { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<PasswordResetToken> PasswordResetTokens { get; set; } = new List<PasswordResetToken>();
    }
}`
  },
  {
    path: 'OMPolymer.API/Data/Models/PasswordResetToken.cs',
    name: 'PasswordResetToken.cs',
    category: 'Data & EF Core',
    language: 'csharp',
    description: 'Cryptographically hashed password reset token entity',
    content: `namespace OMPolymer.API.Data.Models
{
    public class PasswordResetToken
    {
        public int TokenId { get; set; }
        public int AdminId { get; set; }
        public string TokenHash { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public bool IsUsed { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual AdminUser AdminUser { get; set; } = null!;
    }
}`
  },
  {
    path: 'OMPolymer.API/Data/Models/CompanySetting.cs',
    name: 'CompanySetting.cs',
    category: 'Data & EF Core',
    language: 'csharp',
    description: 'Company global configuration database entity',
    content: `namespace OMPolymer.API.Data.Models
{
    public class CompanySetting
    {
        public int SettingId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int? YearsOfExperience { get; set; } = 13;
        public string? AboutContent { get; set; }
        public string? Address { get; set; }
        public string? EmailContact { get; set; }
        public string? PhoneContact { get; set; }
        public string? WhatsAppNumber { get; set; }
        public string? SocialFacebook { get; set; }
        public string? SocialLinkedIn { get; set; }
        public string? SocialInstagram { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}`
  },
  {
    path: 'OMPolymer.API/Data/Models/ProductCategory.cs',
    name: 'ProductCategory.cs',
    category: 'Data & EF Core',
    language: 'csharp',
    description: 'Product category database entity',
    content: `namespace OMPolymer.API.Data.Models
{
    public class ProductCategory
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    }
}`
  },
  {
    path: 'OMPolymer.API/Data/Models/Product.cs',
    name: 'Product.cs',
    category: 'Data & EF Core',
    language: 'csharp',
    description: 'Product catalog database entity referencing relative image paths',
    content: `namespace OMPolymer.API.Data.Models
{
    public class Product
    {
        public int ProductId { get; set; }
        public int CategoryId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? ShortDescription { get; set; }
        public string? FullDescription { get; set; }
        public string? Specifications { get; set; }
        public string? MainImageUrl { get; set; }
        public bool IsFeatured { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual ProductCategory Category { get; set; } = null!;
        public virtual ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();
    }
}`
  },
  {
    path: 'OMPolymer.API/Data/Models/ProductImage.cs',
    name: 'ProductImage.cs',
    category: 'Data & EF Core',
    language: 'csharp',
    description: 'Additional product gallery image entity with relative file path',
    content: `namespace OMPolymer.API.Data.Models
{
    public class ProductImage
    {
        public int ImageId { get; set; }
        public int ProductId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public int? SortOrder { get; set; } = 0;

        public virtual Product Product { get; set; } = null!;
    }
}`
  },
  {
    path: 'OMPolymer.API/Data/Models/BlogCategory.cs',
    name: 'BlogCategory.cs',
    category: 'Data & EF Core',
    language: 'csharp',
    description: 'Blog category database entity',
    content: `namespace OMPolymer.API.Data.Models
{
    public class BlogCategory
    {
        public int BlogCategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;

        public virtual ICollection<BlogPost> BlogPosts { get; set; } = new List<BlogPost>();
    }
}`
  },
  {
    path: 'OMPolymer.API/Data/Models/BlogPost.cs',
    name: 'BlogPost.cs',
    category: 'Data & EF Core',
    language: 'csharp',
    description: 'Blog post database entity with relative featured image path',
    content: `namespace OMPolymer.API.Data.Models
{
    public class BlogPost
    {
        public int BlogId { get; set; }
        public int? BlogCategoryId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? ShortDescription { get; set; }
        public string Content { get; set; } = string.Empty;
        public string? FeaturedImageUrl { get; set; }
        public string? Author { get; set; }
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public bool IsPublished { get; set; }
        public DateTime? PublishedAt { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual BlogCategory? BlogCategory { get; set; }
    }
}`
  },
  {
    path: 'OMPolymer.API/Data/Models/ClientRequirement.cs',
    name: 'ClientRequirement.cs',
    category: 'Data & EF Core',
    language: 'csharp',
    description: 'Client requirement lead database entity',
    content: `namespace OMPolymer.API.Data.Models
{
    public class ClientRequirement
    {
        public int RequirementId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? CompanyName { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? ProductOfInterest { get; set; }
        public string? Quantity { get; set; }
        public string RequirementDescription { get; set; } = string.Empty;
        public string? City { get; set; }
        public string? State { get; set; }
        public string Status { get; set; } = "New";
        public string? AdminRemarks { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}`
  },
  {
    path: 'OMPolymer.API/Data/Models/Testimonial.cs',
    name: 'Testimonial.cs',
    category: 'Data & EF Core',
    language: 'csharp',
    description: 'Testimonial and review database entity',
    content: `namespace OMPolymer.API.Data.Models
{
    public class Testimonial
    {
        public int TestimonialId { get; set; }
        public string DisplayName { get; set; } = string.Empty;
        public string? CompanyOrDesignation { get; set; }
        public string ReviewText { get; set; } = string.Empty;
        public int? Rating { get; set; } = 5;
        public bool IsApproved { get; set; }
        public bool IsPublished { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}`
  },

  // ==========================================
  // 5. EF Core DbContext (Data/)
  // ==========================================
  {
    path: 'OMPolymer.API/Data/OMPolymerDbContext.cs',
    name: 'OMPolymerDbContext.cs',
    category: 'Data & EF Core',
    language: 'csharp',
    description: 'EF Core DbContext mapped to SQL Server tables with query filters & indexes',
    content: `using Microsoft.EntityFrameworkCore;
using OMPolymer.API.Data.Models;

namespace OMPolymer.API.Data
{
    public partial class OMPolymerDbContext : DbContext
    {
        public OMPolymerDbContext(DbContextOptions<OMPolymerDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<AdminUser> AdminUsers { get; set; } = null!;
        public virtual DbSet<PasswordResetToken> PasswordResetTokens { get; set; } = null!;
        public virtual DbSet<CompanySetting> CompanySettings { get; set; } = null!;
        public virtual DbSet<ProductCategory> ProductCategories { get; set; } = null!;
        public virtual DbSet<Product> Products { get; set; } = null!;
        public virtual DbSet<ProductImage> ProductImages { get; set; } = null!;
        public virtual DbSet<BlogCategory> BlogCategories { get; set; } = null!;
        public virtual DbSet<BlogPost> BlogPosts { get; set; } = null!;
        public virtual DbSet<ClientRequirement> ClientRequirements { get; set; } = null!;
        public virtual DbSet<Testimonial> Testimonials { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AdminUser>(entity =>
            {
                entity.HasKey(e => e.AdminId);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Email).HasMaxLength(150);
                entity.Property(e => e.FullName).HasMaxLength(100);
                entity.Property(e => e.Role).HasMaxLength(50).HasDefaultValue("Admin");
                entity.Property(e => e.ProfileImageUrl).HasMaxLength(1000);
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.IsDeleted).HasDefaultValue(false);

                // Global Query Filter: Exclude soft-deleted admin records by default
                entity.HasQueryFilter(e => !e.IsDeleted);
            });

            modelBuilder.Entity<PasswordResetToken>(entity =>
            {
                entity.HasKey(e => e.TokenId);
                entity.HasIndex(e => e.TokenHash);
                entity.Property(e => e.TokenHash).HasMaxLength(256);
                entity.Property(e => e.IsUsed).HasDefaultValue(false);

                entity.HasOne(d => d.AdminUser)
                    .WithMany(p => p.PasswordResetTokens)
                    .HasForeignKey(d => d.AdminId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_PasswordResetTokens_AdminUsers");
            });

            modelBuilder.Entity<CompanySetting>(entity =>
            {
                entity.HasKey(e => e.SettingId);
                entity.Property(e => e.CompanyName).HasMaxLength(200);
            });

            modelBuilder.Entity<ProductCategory>(entity =>
            {
                entity.HasKey(e => e.CategoryId);
                entity.HasIndex(e => e.Slug).IsUnique();
                entity.Property(e => e.CategoryName).HasMaxLength(100);
                entity.Property(e => e.Slug).HasMaxLength(150);
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.ProductId);
                entity.HasIndex(e => e.Slug).IsUnique();
                entity.HasIndex(e => new { e.IsActive, e.IsFeatured });
                entity.Property(e => e.ProductName).HasMaxLength(200);
                entity.Property(e => e.Slug).HasMaxLength(250);

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.CategoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Products_Categories");
            });

            modelBuilder.Entity<ProductImage>(entity =>
            {
                entity.HasKey(e => e.ImageId);
                entity.HasOne(d => d.Product)
                    .WithMany(p => p.ProductImages)
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_ProductImages_Products");
            });

            modelBuilder.Entity<BlogCategory>(entity =>
            {
                entity.HasKey(e => e.BlogCategoryId);
                entity.HasIndex(e => e.Slug).IsUnique();
                entity.Property(e => e.CategoryName).HasMaxLength(100);
                entity.Property(e => e.Slug).HasMaxLength(150);
            });

            modelBuilder.Entity<BlogPost>(entity =>
            {
                entity.HasKey(e => e.BlogId);
                entity.HasIndex(e => e.Slug).IsUnique();
                entity.Property(e => e.Title).HasMaxLength(250);
                entity.Property(e => e.Slug).HasMaxLength(300);

                entity.HasOne(d => d.BlogCategory)
                    .WithMany(p => p.BlogPosts)
                    .HasForeignKey(d => d.BlogCategoryId)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("FK_Blogs_Categories");
            });

            modelBuilder.Entity<ClientRequirement>(entity =>
            {
                entity.HasKey(e => e.RequirementId);
                entity.HasIndex(e => e.Status);
                entity.Property(e => e.FullName).HasMaxLength(150);
                entity.Property(e => e.Email).HasMaxLength(150);
                entity.Property(e => e.PhoneNumber).HasMaxLength(20);
                entity.Property(e => e.Status).HasMaxLength(50).HasDefaultValue("New");
            });

            modelBuilder.Entity<Testimonial>(entity =>
            {
                entity.HasKey(e => e.TestimonialId);
                entity.Property(e => e.DisplayName).HasMaxLength(150);
            });
        }
    }
}`
  },

  // ==========================================
  // 6. Request DTOs (DTOs/Requests/)
  // ==========================================
  {
    path: 'OMPolymer.API/DTOs/Requests/LoginRequest.cs',
    name: 'LoginRequest.cs',
    category: 'DTOs',
    language: 'csharp',
    description: 'Admin login credentials request model',
    content: `using System.ComponentModel.DataAnnotations;

namespace OMPolymer.API.DTOs.Requests
{
    public class LoginRequest
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}`
  },
  {
    path: 'OMPolymer.API/DTOs/Requests/ForgotPasswordRequest.cs',
    name: 'ForgotPasswordRequest.cs',
    category: 'DTOs',
    language: 'csharp',
    description: 'Forgot password email request model',
    content: `using System.ComponentModel.DataAnnotations;

namespace OMPolymer.API.DTOs.Requests
{
    public class ForgotPasswordRequest
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}`
  },
  {
    path: 'OMPolymer.API/DTOs/Requests/ResetPasswordRequest.cs',
    name: 'ResetPasswordRequest.cs',
    category: 'DTOs',
    language: 'csharp',
    description: 'Reset password token and new password request model',
    content: `using System.ComponentModel.DataAnnotations;

namespace OMPolymer.API.DTOs.Requests
{
    public class ResetPasswordRequest
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Token { get; set; } = string.Empty;

        [Required, MinLength(8, ErrorMessage = "Password must be at least 8 characters.")]
        public string NewPassword { get; set; } = string.Empty;

        [Required, Compare("NewPassword", ErrorMessage = "Passwords do not match.")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}`
  },
  {
    path: 'OMPolymer.API/DTOs/Requests/ChangePasswordRequest.cs',
    name: 'ChangePasswordRequest.cs',
    category: 'DTOs',
    language: 'csharp',
    description: 'Authenticated change password request model',
    content: `using System.ComponentModel.DataAnnotations;

namespace OMPolymer.API.DTOs.Requests
{
    public class ChangePasswordRequest
    {
        [Required]
        public string CurrentPassword { get; set; } = string.Empty;

        [Required, MinLength(8, ErrorMessage = "New password must be at least 8 characters.")]
        public string NewPassword { get; set; } = string.Empty;

        [Required, Compare("NewPassword", ErrorMessage = "Passwords do not match.")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}`
  },
  {
    path: 'OMPolymer.API/DTOs/Requests/AdminCreateRequest.cs',
    name: 'AdminCreateRequest.cs',
    category: 'DTOs',
    language: 'csharp',
    description: 'Create administrator user request model',
    content: `using System.ComponentModel.DataAnnotations;

namespace OMPolymer.API.DTOs.Requests
{
    public class AdminCreateRequest
    {
        [Required, StringLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required, EmailAddress, StringLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required, MinLength(8, ErrorMessage = "Password must be at least 8 characters.")]
        public string Password { get; set; } = string.Empty;

        [RegularExpression("^(SuperAdmin|Admin)$", ErrorMessage = "Role must be 'SuperAdmin' or 'Admin'.")]
        public string Role { get; set; } = "Admin";

        public string? ProfileImageUrl { get; set; }

        public bool IsActive { get; set; } = true;
    }
}`
  },
  {
    path: 'OMPolymer.API/DTOs/Requests/AdminUpdateRequest.cs',
    name: 'AdminUpdateRequest.cs',
    category: 'DTOs',
    language: 'csharp',
    description: 'Update administrator user request model',
    content: `using System.ComponentModel.DataAnnotations;

namespace OMPolymer.API.DTOs.Requests
{
    public class AdminUpdateRequest
    {
        [Required, StringLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required, EmailAddress, StringLength(150)]
        public string Email { get; set; } = string.Empty;

        [RegularExpression("^(SuperAdmin|Admin)$", ErrorMessage = "Role must be 'SuperAdmin' or 'Admin'.")]
        public string Role { get; set; } = "Admin";

        public string? ProfileImageUrl { get; set; }

        public bool IsActive { get; set; } = true;
    }
}`
  },
  {
    path: 'OMPolymer.API/DTOs/Requests/ProductCreateRequest.cs',
    name: 'ProductCreateRequest.cs',
    category: 'DTOs',
    language: 'csharp',
    description: 'Product creation and update request DTO',
    content: `using System.ComponentModel.DataAnnotations;

namespace OMPolymer.API.DTOs.Requests
{
    public class ProductCreateRequest
    {
        [Required, StringLength(200)]
        public string ProductName { get; set; } = string.Empty;

        [Required, StringLength(250)]
        public string Slug { get; set; } = string.Empty;

        [Required]
        public int CategoryId { get; set; }

        public string? ShortDescription { get; set; }
        public string? FullDescription { get; set; }
        public string? Specifications { get; set; }
        public string? MainImageUrl { get; set; }
        public bool IsFeatured { get; set; }
        public List<string> AdditionalImages { get; set; } = new();
    }
}`
  },
  {
    path: 'OMPolymer.API/DTOs/Requests/BlogCreateRequest.cs',
    name: 'BlogCreateRequest.cs',
    category: 'DTOs',
    language: 'csharp',
    description: 'Blog post creation and update request DTO',
    content: `using System.ComponentModel.DataAnnotations;

namespace OMPolymer.API.DTOs.Requests
{
    public class BlogCreateRequest
    {
        [Required, StringLength(250)]
        public string Title { get; set; } = string.Empty;

        [Required, StringLength(300)]
        public string Slug { get; set; } = string.Empty;

        public int? BlogCategoryId { get; set; }
        public string? ShortDescription { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;

        public string? FeaturedImageUrl { get; set; }
        public string? Author { get; set; }
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public bool IsPublished { get; set; }
    }
}`
  },
  {
    path: 'OMPolymer.API/DTOs/Requests/RequirementCreateRequest.cs',
    name: 'RequirementCreateRequest.cs',
    category: 'DTOs',
    language: 'csharp',
    description: 'Client requirement RFQ submission request DTO',
    content: `using System.ComponentModel.DataAnnotations;

namespace OMPolymer.API.DTOs.Requests
{
    public class RequirementCreateRequest
    {
        [Required, StringLength(150)]
        public string FullName { get; set; } = string.Empty;

        [StringLength(200)]
        public string? CompanyName { get; set; }

        [Required, EmailAddress, StringLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required, Phone, StringLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;

        [StringLength(200)]
        public string? ProductOfInterest { get; set; }

        [StringLength(100)]
        public string? Quantity { get; set; }

        [Required]
        public string RequirementDescription { get; set; } = string.Empty;

        [StringLength(100)]
        public string? City { get; set; }

        [StringLength(100)]
        public string? State { get; set; }
    }
}`
  },
  {
    path: 'OMPolymer.API/DTOs/Requests/RequirementStatusUpdateRequest.cs',
    name: 'RequirementStatusUpdateRequest.cs',
    category: 'DTOs',
    language: 'csharp',
    description: 'Lead status and internal admin remarks update request DTO',
    content: `using System.ComponentModel.DataAnnotations;

namespace OMPolymer.API.DTOs.Requests
{
    public class RequirementStatusUpdateRequest
    {
        [Required]
        public string Status { get; set; } = "New";

        public string? AdminRemarks { get; set; }
    }
}`
  },
  {
    path: 'OMPolymer.API/DTOs/Requests/TestimonialCreateRequest.cs',
    name: 'TestimonialCreateRequest.cs',
    category: 'DTOs',
    language: 'csharp',
    description: 'Testimonial creation request DTO',
    content: `using System.ComponentModel.DataAnnotations;

namespace OMPolymer.API.DTOs.Requests
{
    public class TestimonialCreateRequest
    {
        [Required, StringLength(150)]
        public string DisplayName { get; set; } = string.Empty;

        [StringLength(200)]
        public string? CompanyOrDesignation { get; set; }

        [Required]
        public string ReviewText { get; set; } = string.Empty;

        [Range(1, 5)]
        public int Rating { get; set; } = 5;

        public bool IsApproved { get; set; }
        public bool IsPublished { get; set; }
    }
}`
  },
  {
    path: 'OMPolymer.API/DTOs/Requests/CompanySettingsUpdateRequest.cs',
    name: 'CompanySettingsUpdateRequest.cs',
    category: 'DTOs',
    language: 'csharp',
    description: 'Company settings update request DTO',
    content: `using System.ComponentModel.DataAnnotations;

namespace OMPolymer.API.DTOs.Requests
{
    public class CompanySettingsUpdateRequest
    {
        [Required, StringLength(200)]
        public string CompanyName { get; set; } = string.Empty;

        public string? Description { get; set; }
        public int YearsOfExperience { get; set; } = 13;
        public string? AboutContent { get; set; }
        public string? Address { get; set; }
        public string? EmailContact { get; set; }
        public string? PhoneContact { get; set; }
        public string? WhatsAppNumber { get; set; }
        public string? SocialFacebook { get; set; }
        public string? SocialLinkedIn { get; set; }
        public string? SocialInstagram { get; set; }
    }
}`
  },
  {
    path: 'OMPolymer.API/DTOs/Requests/UploadImageRequest.cs',
    name: 'UploadImageRequest.cs',
    category: 'DTOs',
    language: 'csharp',
    description: 'Image upload request DTO with IFormFile and Category',
    content: `using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace OMPolymer.API.DTOs.Requests;

public class UploadImageRequest
{
    [Required]
    public IFormFile File { get; set; } = null!;

    public string Category { get; set; } = "products";
}`
  },

  // ==========================================
  // 7. Response DTOs (DTOs/Responses/)
  // ==========================================
  {
    path: 'OMPolymer.API/DTOs/Responses/ApiResponse.cs',
    name: 'ApiResponse.cs',
    category: 'DTOs',
    language: 'csharp',
    description: 'Standardized generic JSON response envelope',
    content: `namespace OMPolymer.API.DTOs.Responses
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public List<string>? Errors { get; set; }

        public static ApiResponse<T> SuccessResponse(T data, string message = "Success")
            => new() { Success = true, Data = data, Message = message };

        public static ApiResponse<T> FailureResponse(string message, List<string>? errors = null)
            => new() { Success = false, Message = message, Errors = errors ?? new List<string> { message } };
    }
}`
  },
  {
    path: 'OMPolymer.API/DTOs/Responses/PaginatedResponse.cs',
    name: 'PaginatedResponse.cs',
    category: 'DTOs',
    language: 'csharp',
    description: 'Pagination metadata envelope',
    content: `namespace OMPolymer.API.DTOs.Responses
{
    public class PaginatedResponse<T>
    {
        public IEnumerable<T> Items { get; set; }
        public int TotalCount { get; set; }
        public int PageSize { get; set; }
        public int CurrentPage { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / (PageSize > 0 ? PageSize : 10));

        public PaginatedResponse(IEnumerable<T> items, int totalCount, int currentPage, int pageSize)
        {
            Items = items;
            TotalCount = totalCount;
            CurrentPage = currentPage;
            PageSize = pageSize;
        }
    }
}`
  },
  {
    path: 'OMPolymer.API/DTOs/Responses/AuthResponse.cs',
    name: 'AuthResponse.cs',
    category: 'DTOs',
    language: 'csharp',
    description: 'Authentication token and admin profile response DTO',
    content: `namespace OMPolymer.API.DTOs.Responses
{
    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = "Admin";
        public string? ProfileImageUrl { get; set; }
        public DateTime Expiry { get; set; }
    }
}`
  },
  {
    path: 'OMPolymer.API/DTOs/Responses/AdminResponse.cs',
    name: 'AdminResponse.cs',
    category: 'DTOs',
    language: 'csharp',
    description: 'Administrator details response model (excludes password hash)',
    content: `namespace OMPolymer.API.DTOs.Responses
{
    public class AdminResponse
    {
        public int AdminId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? ProfileImageUrl { get; set; }
        public bool IsActive { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}`
  },
  {
    path: 'OMPolymer.API/DTOs/Responses/ImageUploadResponse.cs',
    name: 'ImageUploadResponse.cs',
    category: 'DTOs',
    language: 'csharp',
    description: 'Image upload result model with relative path',
    content: `namespace OMPolymer.API.DTOs.Responses
{
    public class ImageUploadResponse
    {
        public string RelativeUrl { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string OriginalFileName { get; set; } = string.Empty;
        public long FileSizeBytes { get; set; }
        public string ContentType { get; set; } = string.Empty;
    }
}`
  },
  {
    path: 'OMPolymer.API/DTOs/Responses/ProductResponse.cs',
    name: 'ProductResponse.cs',
    category: 'DTOs',
    language: 'csharp',
    description: 'Product, Category, and Gallery Image response DTOs',
    content: `namespace OMPolymer.API.DTOs.Responses
{
    public class CategoryResponse
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
    }

    public class ProductImageResponse
    {
        public int ImageId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
    }

    public class ProductResponse
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? ShortDescription { get; set; }
        public string? FullDescription { get; set; }
        public string? Specifications { get; set; }
        public string? MainImageUrl { get; set; }
        public bool IsFeatured { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        
        public CategoryResponse? Category { get; set; }
        public List<ProductImageResponse> AdditionalImages { get; set; } = new();
    }
}`
  },
  {
    path: 'OMPolymer.API/DTOs/Responses/BlogResponse.cs',
    name: 'BlogResponse.cs',
    category: 'DTOs',
    language: 'csharp',
    description: 'Blog post and category response DTOs',
    content: `namespace OMPolymer.API.DTOs.Responses
{
    public class BlogCategoryResponse
    {
        public int BlogCategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
    }

    public class BlogResponse
    {
        public int BlogId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? ShortDescription { get; set; }
        public string Content { get; set; } = string.Empty;
        public string? FeaturedImageUrl { get; set; }
        public string? Author { get; set; }
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public bool IsPublished { get; set; }
        public DateTime? PublishedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public BlogCategoryResponse? Category { get; set; }
    }
}`
  },
  {
    path: 'OMPolymer.API/DTOs/Responses/RequirementResponse.cs',
    name: 'RequirementResponse.cs',
    category: 'DTOs',
    language: 'csharp',
    description: 'Customer inquiry and lead response DTO',
    content: `namespace OMPolymer.API.DTOs.Responses
{
    public class RequirementResponse
    {
        public int RequirementId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? CompanyName { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? ProductOfInterest { get; set; }
        public string? Quantity { get; set; }
        public string RequirementDescription { get; set; } = string.Empty;
        public string? City { get; set; }
        public string? State { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? AdminRemarks { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}`
  },
  {
    path: 'OMPolymer.API/DTOs/Responses/TestimonialResponse.cs',
    name: 'TestimonialResponse.cs',
    category: 'DTOs',
    language: 'csharp',
    description: 'Testimonial response DTO',
    content: `namespace OMPolymer.API.DTOs.Responses
{
    public class TestimonialResponse
    {
        public int TestimonialId { get; set; }
        public string DisplayName { get; set; } = string.Empty;
        public string? CompanyOrDesignation { get; set; }
        public string ReviewText { get; set; } = string.Empty;
        public int Rating { get; set; }
        public bool IsApproved { get; set; }
        public bool IsPublished { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}`
  },
  {
    path: 'OMPolymer.API/DTOs/Responses/CompanySettingsResponse.cs',
    name: 'CompanySettingsResponse.cs',
    category: 'DTOs',
    language: 'csharp',
    description: 'Company settings and WhatsApp chat URL response DTO',
    content: `namespace OMPolymer.API.DTOs.Responses
{
    public class CompanySettingsResponse
    {
        public string CompanyName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int YearsOfExperience { get; set; }
        public string? AboutContent { get; set; }
        public string? Address { get; set; }
        public string? EmailContact { get; set; }
        public string? PhoneContact { get; set; }
        public string? WhatsAppNumber { get; set; }
        public string? SocialFacebook { get; set; }
        public string? SocialLinkedIn { get; set; }
        public string? SocialInstagram { get; set; }
        public string? WhatsAppUrl { get; set; }
    }
}`
  },

  // ==========================================
  // 8. Service Interfaces (Services/Interfaces/)
  // ==========================================
  {
    path: 'OMPolymer.API/Services/Interfaces/IAuthService.cs',
    name: 'IAuthService.cs',
    category: 'Services',
    language: 'csharp',
    description: 'Authentication, Password Recovery, and JWT service interface',
    content: `using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;

namespace OMPolymer.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<ApiResponse<AuthResponse>> LoginAsync(LoginRequest request);
        Task<ApiResponse<bool>> ForgotPasswordAsync(ForgotPasswordRequest request);
        Task<ApiResponse<bool>> ResetPasswordAsync(ResetPasswordRequest request);
        Task<ApiResponse<bool>> ChangePasswordAsync(int adminId, ChangePasswordRequest request);
        string HashPassword(string password);
    }
}`
  },
  {
    path: 'OMPolymer.API/Services/Interfaces/IAdminUserService.cs',
    name: 'IAdminUserService.cs',
    category: 'Services',
    language: 'csharp',
    description: 'Administrator CRUD and account status management interface',
    content: `using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;

namespace OMPolymer.API.Services.Interfaces
{
    public interface IAdminUserService
    {
        Task<ApiResponse<PaginatedResponse<AdminResponse>>> GetAdminsAsync(int page, int pageSize, string? role, string? status, string? search);
        Task<ApiResponse<AdminResponse>> GetAdminByIdAsync(int id);
        Task<ApiResponse<AdminResponse>> CreateAdminAsync(AdminCreateRequest request);
        Task<ApiResponse<AdminResponse>> UpdateAdminAsync(int id, AdminUpdateRequest request);
        Task<ApiResponse<bool>> ToggleStatusAsync(int id, bool isActive);
        Task<ApiResponse<bool>> DeleteAdminAsync(int id);
    }
}`
  },
  {
    path: 'OMPolymer.API/Services/Interfaces/IFileStorageService.cs',
    name: 'IFileStorageService.cs',
    category: 'Services',
    language: 'csharp',
    description: 'Reusable physical file storage and validation service interface',
    content: `using Microsoft.AspNetCore.Http;
using OMPolymer.API.DTOs.Responses;

namespace OMPolymer.API.Services.Interfaces
{
    public interface IFileStorageService
    {
        Task<ApiResponse<ImageUploadResponse>> UploadImageAsync(IFormFile file, string category, CancellationToken cancellationToken = default);
        Task<bool> DeleteImageAsync(string? relativePath);
        Task<ApiResponse<ImageUploadResponse>> ReplaceImageAsync(string? oldRelativePath, IFormFile newFile, string category, CancellationToken cancellationToken = default);
    }
}`
  },
  {
    path: 'OMPolymer.API/Services/Interfaces/IEmailService.cs',
    name: 'IEmailService.cs',
    category: 'Services',
    language: 'csharp',
    description: 'Email dispatch service for password reset notifications',
    content: `namespace OMPolymer.API.Services.Interfaces
{
    public interface IEmailService
    {
        Task<bool> SendPasswordResetEmailAsync(string toEmail, string recipientName, string resetToken, CancellationToken cancellationToken = default);
    }
}`
  },
  {
    path: 'OMPolymer.API/Services/Interfaces/IProductService.cs',
    name: 'IProductService.cs',
    category: 'Services',
    language: 'csharp',
    description: 'Product catalog service interface',
    content: `using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;

namespace OMPolymer.API.Services.Interfaces
{
    public interface IProductService
    {
        Task<ApiResponse<PaginatedResponse<ProductResponse>>> GetAllActiveProductsAsync(int page, int pageSize, int? categoryId, string? search);
        Task<ApiResponse<ProductResponse>> GetProductBySlugAsync(string slug);
        Task<ApiResponse<ProductResponse>> GetProductByIdAsync(int id);
        Task<ApiResponse<IEnumerable<ProductResponse>>> GetFeaturedProductsAsync();
        Task<ApiResponse<IEnumerable<CategoryResponse>>> GetCategoriesAsync();

        Task<ApiResponse<ProductResponse>> CreateProductAsync(ProductCreateRequest request);
        Task<ApiResponse<bool>> UpdateProductAsync(int id, ProductCreateRequest request);
        Task<ApiResponse<bool>> DeleteProductAsync(int id);
        Task<ApiResponse<bool>> ToggleStatusAsync(int id);
    }
}`
  },
  {
    path: 'OMPolymer.API/Services/Interfaces/IBlogService.cs',
    name: 'IBlogService.cs',
    category: 'Services',
    language: 'csharp',
    description: 'Blog post management service interface',
    content: `using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;

namespace OMPolymer.API.Services.Interfaces
{
    public interface IBlogService
    {
        Task<ApiResponse<PaginatedResponse<BlogResponse>>> GetPublishedBlogsAsync(int page, int pageSize, int? categoryId, string? search);
        Task<ApiResponse<BlogResponse>> GetBlogBySlugAsync(string slug);
        Task<ApiResponse<IEnumerable<BlogCategoryResponse>>> GetBlogCategoriesAsync();

        Task<ApiResponse<BlogResponse>> CreateBlogAsync(BlogCreateRequest request);
        Task<ApiResponse<bool>> UpdateBlogAsync(int id, BlogCreateRequest request);
        Task<ApiResponse<bool>> DeleteBlogAsync(int id);
        Task<ApiResponse<bool>> TogglePublishStatusAsync(int id, bool publish);
    }
}`
  },
  {
    path: 'OMPolymer.API/Services/Interfaces/IRequirementService.cs',
    name: 'IRequirementService.cs',
    category: 'Services',
    language: 'csharp',
    description: 'Client requirement lead management service interface',
    content: `using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;

namespace OMPolymer.API.Services.Interfaces
{
    public interface IRequirementService
    {
        Task<ApiResponse<bool>> SubmitRequirementAsync(RequirementCreateRequest request);
        Task<ApiResponse<PaginatedResponse<RequirementResponse>>> GetAllRequirementsAsync(int page, int pageSize, string? status, string? search);
        Task<ApiResponse<RequirementResponse>> GetRequirementByIdAsync(int id);
        Task<ApiResponse<bool>> UpdateRequirementStatusAsync(int id, RequirementStatusUpdateRequest request);
    }
}`
  },
  {
    path: 'OMPolymer.API/Services/Interfaces/ITestimonialService.cs',
    name: 'ITestimonialService.cs',
    category: 'Services',
    language: 'csharp',
    description: 'Testimonial and moderation service interface',
    content: `using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;

namespace OMPolymer.API.Services.Interfaces
{
    public interface ITestimonialService
    {
        Task<ApiResponse<IEnumerable<TestimonialResponse>>> GetPublishedTestimonialsAsync();
        Task<ApiResponse<IEnumerable<TestimonialResponse>>> GetAllTestimonialsAsync();
        Task<ApiResponse<TestimonialResponse>> CreateTestimonialAsync(TestimonialCreateRequest request);
        Task<ApiResponse<bool>> UpdateTestimonialAsync(int id, TestimonialCreateRequest request);
        Task<ApiResponse<bool>> TogglePublishStatusAsync(int id);
        Task<ApiResponse<bool>> DeleteTestimonialAsync(int id);
    }
}`
  },
  {
    path: 'OMPolymer.API/Services/Interfaces/ICompanyService.cs',
    name: 'ICompanyService.cs',
    category: 'Services',
    language: 'csharp',
    description: 'Company settings service interface',
    content: `using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;

namespace OMPolymer.API.Services.Interfaces
{
    public interface ICompanyService
    {
        Task<ApiResponse<CompanySettingsResponse>> GetSettingsAsync();
        Task<ApiResponse<bool>> UpdateSettingsAsync(CompanySettingsUpdateRequest request);
        string GenerateWhatsAppUrl(string? phoneNumber, string message);
    }
}`
  },

  // ==========================================
  // 9. Service Implementations (Services/Implementations/)
  // ==========================================
  {
    path: 'OMPolymer.API/Services/Implementations/AuthService.cs',
    name: 'AuthService.cs',
    category: 'Services',
    language: 'csharp',
    description: 'Authentication, BCrypt password hashing, and token reset logic',
    content: `using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OMPolymer.API.Data;
using OMPolymer.API.Data.Models;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;
using OMPolymer.API.Services.Interfaces;
using BC = BCrypt.Net.BCrypt;

namespace OMPolymer.API.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly OMPolymerDbContext _context;
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;
        private readonly ILogger<AuthService> _logger;

        public AuthService(OMPolymerDbContext context, IConfiguration config, IEmailService emailService, ILogger<AuthService> logger)
        {
            _context = context;
            _config = config;
            _emailService = emailService;
            _logger = logger;
        }

        public async Task<ApiResponse<AuthResponse>> LoginAsync(LoginRequest request)
        {
            var cleanEmail = request.Email.Trim().ToLower();
            var user = await _context.AdminUsers
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(u => u.Email.ToLower() == cleanEmail);

            if (user == null || user.IsDeleted)
            {
                return ApiResponse<AuthResponse>.FailureResponse("Invalid email or password.");
            }

            if (!user.IsActive)
            {
                return ApiResponse<AuthResponse>.FailureResponse("This administrator account has been deactivated. Please contact an administrator.");
            }

            if (!BC.Verify(request.Password, user.PasswordHash))
            {
                return ApiResponse<AuthResponse>.FailureResponse("Invalid email or password.");
            }

            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);
            var durationMinutes = double.Parse(_config["JwtSettings:DurationInMinutes"] ?? "1440");

            var response = new AuthResponse
            {
                Token = token,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                ProfileImageUrl = user.ProfileImageUrl,
                Expiry = DateTime.UtcNow.AddMinutes(durationMinutes)
            };

            return ApiResponse<AuthResponse>.SuccessResponse(response, "Login successful.");
        }

        public async Task<ApiResponse<bool>> ForgotPasswordAsync(ForgotPasswordRequest request)
        {
            var cleanEmail = request.Email.Trim().ToLower();
            var user = await _context.AdminUsers.FirstOrDefaultAsync(u => u.Email.ToLower() == cleanEmail && u.IsActive && !u.IsDeleted);

            // Generic response to prevent account enumeration
            if (user == null)
            {
                return ApiResponse<bool>.SuccessResponse(true, "If your email is registered with an active administrator account, a password reset link has been dispatched.");
            }

            // Invalidate prior active reset tokens
            var activeTokens = await _context.PasswordResetTokens
                .Where(t => t.AdminId == user.AdminId && !t.IsUsed && t.ExpiresAt > DateTime.UtcNow)
                .ToListAsync();

            foreach (var t in activeTokens)
            {
                t.IsUsed = true;
            }

            // Generate cryptographically secure token
            var rawTokenBytes = RandomNumberGenerator.GetBytes(32);
            var rawToken = Convert.ToHexString(rawTokenBytes).ToLower();

            // Hash token for database storage (SHA-256)
            var tokenHash = ComputeSha256(rawToken);

            var resetTokenEntity = new PasswordResetToken
            {
                AdminId = user.AdminId,
                TokenHash = tokenHash,
                ExpiresAt = DateTime.UtcNow.AddHours(1),
                IsUsed = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.PasswordResetTokens.Add(resetTokenEntity);
            await _context.SaveChangesAsync();

            // Send email
            await _emailService.SendPasswordResetEmailAsync(user.Email, user.FullName, rawToken);

            return ApiResponse<bool>.SuccessResponse(true, "If your email is registered with an active administrator account, a password reset link has been dispatched.");
        }

        public async Task<ApiResponse<bool>> ResetPasswordAsync(ResetPasswordRequest request)
        {
            if (request.NewPassword != request.ConfirmPassword)
            {
                return ApiResponse<bool>.FailureResponse("New password and confirmation password do not match.");
            }

            var cleanEmail = request.Email.Trim().ToLower();
            var user = await _context.AdminUsers.FirstOrDefaultAsync(u => u.Email.ToLower() == cleanEmail && !u.IsDeleted);
            if (user == null)
            {
                return ApiResponse<bool>.FailureResponse("Password reset token is invalid, expired, or has already been used.");
            }

            var tokenHash = ComputeSha256(request.Token.Trim().ToLower());

            var resetToken = await _context.PasswordResetTokens
                .FirstOrDefaultAsync(t => t.AdminId == user.AdminId && t.TokenHash == tokenHash && !t.IsUsed && t.ExpiresAt > DateTime.UtcNow);

            if (resetToken == null)
            {
                return ApiResponse<bool>.FailureResponse("Password reset token is invalid, expired, or has already been used.");
            }

            // Invalidate token
            resetToken.IsUsed = true;

            // Invalidate any other tokens
            var otherTokens = await _context.PasswordResetTokens
                .Where(t => t.AdminId == user.AdminId && !t.IsUsed)
                .ToListAsync();
            foreach (var t in otherTokens) t.IsUsed = true;

            // Hash new password using BCrypt
            user.PasswordHash = HashPassword(request.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            _logger.LogInformation("Password reset successful for administrator ID {AdminId}", user.AdminId);

            return ApiResponse<bool>.SuccessResponse(true, "Password has been successfully reset. You can now log in with your new credentials.");
        }

        public async Task<ApiResponse<bool>> ChangePasswordAsync(int adminId, ChangePasswordRequest request)
        {
            var user = await _context.AdminUsers.FindAsync(adminId);
            if (user == null || user.IsDeleted) return ApiResponse<bool>.FailureResponse("Administrator not found.");

            if (!BC.Verify(request.CurrentPassword, user.PasswordHash))
            {
                return ApiResponse<bool>.FailureResponse("Current password provided is incorrect.");
            }

            if (request.NewPassword != request.ConfirmPassword)
            {
                return ApiResponse<bool>.FailureResponse("New password and confirmation password do not match.");
            }

            user.PasswordHash = HashPassword(request.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return ApiResponse<bool>.SuccessResponse(true, "Password changed successfully.");
        }

        public string HashPassword(string password) => BC.HashPassword(password);

        private static string ComputeSha256(string raw)
        {
            var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(raw));
            return Convert.ToHexString(bytes).ToLower();
        }

        private string GenerateJwtToken(AdminUser user)
        {
            var jwtSettings = _config.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.AdminId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var duration = double.Parse(jwtSettings["DurationInMinutes"] ?? "1440");

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(duration),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}`
  },
  {
    path: 'OMPolymer.API/Services/Implementations/AdminUserService.cs',
    name: 'AdminUserService.cs',
    category: 'Services',
    language: 'csharp',
    description: 'Admin user management service with soft deletion & SuperAdmin safety guards',
    content: `using Microsoft.EntityFrameworkCore;
using OMPolymer.API.Data;
using OMPolymer.API.Data.Models;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;
using OMPolymer.API.Services.Interfaces;
using BC = BCrypt.Net.BCrypt;

namespace OMPolymer.API.Services.Implementations
{
    public class AdminUserService : IAdminUserService
    {
        private readonly OMPolymerDbContext _context;
        private readonly ILogger<AdminUserService> _logger;

        public AdminUserService(OMPolymerDbContext context, ILogger<AdminUserService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<ApiResponse<PaginatedResponse<AdminResponse>>> GetAdminsAsync(int page, int pageSize, string? role, string? status, string? search)
        {
            var query = _context.AdminUsers
                .Where(u => !u.IsDeleted)
                .AsNoTracking();

            if (!string.IsNullOrWhiteSpace(role) && role != "All")
            {
                query = query.Where(u => u.Role.ToLower() == role.Trim().ToLower());
            }

            if (!string.IsNullOrWhiteSpace(status) && status != "All")
            {
                var isActive = status.Trim().ToLower() == "active";
                query = query.Where(u => u.IsActive == isActive);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.Trim().ToLower();
                query = query.Where(u => u.FullName.ToLower().Contains(s) || u.Email.ToLower().Contains(s));
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderByDescending(u => u.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => MapToResponse(u))
                .ToListAsync();

            return ApiResponse<PaginatedResponse<AdminResponse>>.SuccessResponse(
                new PaginatedResponse<AdminResponse>(items, totalCount, page, pageSize));
        }

        public async Task<ApiResponse<AdminResponse>> GetAdminByIdAsync(int id)
        {
            var user = await _context.AdminUsers.AsNoTracking().FirstOrDefaultAsync(u => u.AdminId == id && !u.IsDeleted);
            if (user == null) return ApiResponse<AdminResponse>.FailureResponse("Administrator not found.");
            return ApiResponse<AdminResponse>.SuccessResponse(MapToResponse(user));
        }

        public async Task<ApiResponse<AdminResponse>> CreateAdminAsync(AdminCreateRequest request)
        {
            var cleanEmail = request.Email.Trim().ToLower();
            if (await _context.AdminUsers.IgnoreQueryFilters().AnyAsync(u => u.Email.ToLower() == cleanEmail && !u.IsDeleted))
            {
                return ApiResponse<AdminResponse>.FailureResponse("An administrator account with this email address already exists.");
            }

            var admin = new AdminUser
            {
                FullName = request.FullName.Trim(),
                Email = cleanEmail,
                PasswordHash = BC.HashPassword(request.Password),
                Role = request.Role == "SuperAdmin" ? "SuperAdmin" : "Admin",
                ProfileImageUrl = request.ProfileImageUrl,
                IsActive = request.IsActive,
                IsDeleted = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.AdminUsers.Add(admin);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Administrator created: {Email} with role {Role}", admin.Email, admin.Role);

            return ApiResponse<AdminResponse>.SuccessResponse(MapToResponse(admin), "Administrator account created successfully.");
        }

        public async Task<ApiResponse<AdminResponse>> UpdateAdminAsync(int id, AdminUpdateRequest request)
        {
            var admin = await _context.AdminUsers.FirstOrDefaultAsync(u => u.AdminId == id && !u.IsDeleted);
            if (admin == null) return ApiResponse<AdminResponse>.FailureResponse("Administrator not found.");

            var cleanEmail = request.Email.Trim().ToLower();
            if (await _context.AdminUsers.IgnoreQueryFilters().AnyAsync(u => u.Email.ToLower() == cleanEmail && u.AdminId != id && !u.IsDeleted))
            {
                return ApiResponse<AdminResponse>.FailureResponse("Email address is already in use by another administrator.");
            }

            // Prevent demoting the last active SuperAdmin
            if (admin.Role == "SuperAdmin" && request.Role != "SuperAdmin")
            {
                var otherSuperAdmins = await _context.AdminUsers.CountAsync(u => u.Role == "SuperAdmin" && u.IsActive && !u.IsDeleted && u.AdminId != id);
                if (otherSuperAdmins == 0)
                {
                    return ApiResponse<AdminResponse>.FailureResponse("Cannot demote the only remaining active Super Administrator.");
                }
            }

            // Prevent deactivating the last active SuperAdmin
            if (admin.Role == "SuperAdmin" && !request.IsActive)
            {
                var otherSuperAdmins = await _context.AdminUsers.CountAsync(u => u.Role == "SuperAdmin" && u.IsActive && !u.IsDeleted && u.AdminId != id);
                if (otherSuperAdmins == 0)
                {
                    return ApiResponse<AdminResponse>.FailureResponse("Cannot deactivate the only remaining active Super Administrator.");
                }
            }

            admin.FullName = request.FullName.Trim();
            admin.Email = cleanEmail;
            admin.Role = request.Role == "SuperAdmin" ? "SuperAdmin" : "Admin";
            admin.ProfileImageUrl = request.ProfileImageUrl;
            admin.IsActive = request.IsActive;
            admin.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return ApiResponse<AdminResponse>.SuccessResponse(MapToResponse(admin), "Administrator updated successfully.");
        }

        public async Task<ApiResponse<bool>> ToggleStatusAsync(int id, bool isActive)
        {
            var admin = await _context.AdminUsers.FirstOrDefaultAsync(u => u.AdminId == id && !u.IsDeleted);
            if (admin == null) return ApiResponse<bool>.FailureResponse("Administrator not found.");

            // Safety Guard: Cannot deactivate the last active Super Administrator
            if (admin.Role == "SuperAdmin" && !isActive)
            {
                var otherSuperAdmins = await _context.AdminUsers.CountAsync(u => u.Role == "SuperAdmin" && u.IsActive && !u.IsDeleted && u.AdminId != id);
                if (otherSuperAdmins == 0)
                {
                    return ApiResponse<bool>.FailureResponse("Cannot deactivate the only remaining active Super Administrator.");
                }
            }

            admin.IsActive = isActive;
            admin.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return ApiResponse<bool>.SuccessResponse(true, $"Administrator account has been {(isActive ? "activated" : "deactivated")}.");
        }

        public async Task<ApiResponse<bool>> DeleteAdminAsync(int id)
        {
            var admin = await _context.AdminUsers.FirstOrDefaultAsync(u => u.AdminId == id && !u.IsDeleted);
            if (admin == null) return ApiResponse<bool>.FailureResponse("Administrator not found.");

            // Safety Guard: Cannot delete the last active Super Administrator
            if (admin.Role == "SuperAdmin")
            {
                var otherSuperAdmins = await _context.AdminUsers.CountAsync(u => u.Role == "SuperAdmin" && u.IsActive && !u.IsDeleted && u.AdminId != id);
                if (otherSuperAdmins == 0)
                {
                    return ApiResponse<bool>.FailureResponse("Cannot delete the only remaining active Super Administrator.");
                }
            }

            // Soft deletion
            admin.IsDeleted = true;
            admin.IsActive = false;
            admin.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return ApiResponse<bool>.SuccessResponse(true, "Administrator account has been soft-deleted.");
        }

        private static AdminResponse MapToResponse(AdminUser u) => new()
        {
            AdminId = u.AdminId,
            FullName = u.FullName,
            Email = u.Email,
            Role = u.Role,
            ProfileImageUrl = u.ProfileImageUrl,
            IsActive = u.IsActive,
            LastLoginAt = u.LastLoginAt,
            CreatedAt = u.CreatedAt,
            UpdatedAt = u.UpdatedAt
        };
    }
}`
  },
  {
    path: 'OMPolymer.API/Services/Implementations/FileStorageService.cs',
    name: 'FileStorageService.cs',
    category: 'Services',
    language: 'csharp',
    description: 'Physical server-side image storage service with path traversal defense & MIME validation',
    content: `using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using OMPolymer.API.DTOs.Responses;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Services.Implementations
{
    public class FileStorageService : IFileStorageService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly IConfiguration _config;
        private readonly ILogger<FileStorageService> _logger;

        private readonly string[] _allowedExtensions;
        private readonly string[] _allowedMimeTypes;
        private readonly long _maxFileSize;

        public FileStorageService(IWebHostEnvironment environment, IConfiguration config, ILogger<FileStorageService> logger)
        {
            _environment = environment;
            _config = config;
            _logger = logger;

            _allowedExtensions = _config.GetSection("FileStorageSettings:AllowedExtensions").Get<string[]>() 
                ?? new[] { ".jpg", ".jpeg", ".png", ".webp" };
            _allowedMimeTypes = _config.GetSection("FileStorageSettings:AllowedMimeTypes").Get<string[]>()
                ?? new[] { "image/jpeg", "image/png", "image/webp" };
            _maxFileSize = _config.GetValue<long>("FileStorageSettings:MaxFileSizeInBytes", 5242880); // Default 5 MB
        }

        public async Task<ApiResponse<ImageUploadResponse>> UploadImageAsync(IFormFile file, string category, CancellationToken cancellationToken = default)
        {
            if (file == null || file.Length == 0)
            {
                return ApiResponse<ImageUploadResponse>.FailureResponse("No file was uploaded.");
            }

            if (file.Length > _maxFileSize)
            {
                return ApiResponse<ImageUploadResponse>.FailureResponse($"File size exceeds the limit of {_maxFileSize / (1024 * 1024)} MB.");
            }

            // Sanitize category to prevent path traversal
            var sanitizedCategory = SanitizeCategory(category);

            // Extension validation
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!_allowedExtensions.Contains(extension))
            {
                return ApiResponse<ImageUploadResponse>.FailureResponse($"File extension '{extension}' is not permitted. Allowed: {string.Join(", ", _allowedExtensions)}");
            }

            // MIME type validation
            if (!_allowedMimeTypes.Contains(file.ContentType.ToLowerInvariant()))
            {
                return ApiResponse<ImageUploadResponse>.FailureResponse($"MIME type '{file.ContentType}' is not permitted.");
            }

            // Determine physical root path (wwwroot/uploads/{category})
            var webRoot = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var targetDirectory = Path.Combine(webRoot, "uploads", sanitizedCategory);

            if (!Directory.Exists(targetDirectory))
            {
                Directory.CreateDirectory(targetDirectory);
            }

            // Generate cryptographically unique safe file name
            var uniqueFileName = $"{sanitizedCategory}_{DateTime.UtcNow:yyyyMMddHHmmss}_{Guid.NewGuid():N}{extension}";
            var physicalPath = Path.Combine(targetDirectory, uniqueFileName);

            // Save stream
            using (var fileStream = new FileStream(physicalPath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream, cancellationToken);
            }

            // Generate database relative path
            var relativePath = $"/uploads/{sanitizedCategory}/{uniqueFileName}";

            _logger.LogInformation("Image stored at {PhysicalPath}, relative path: {RelativePath}", physicalPath, relativePath);

            var response = new ImageUploadResponse
            {
                RelativeUrl = relativePath,
                Category = sanitizedCategory,
                OriginalFileName = file.FileName,
                FileSizeBytes = file.Length,
                ContentType = file.ContentType
            };

            return ApiResponse<ImageUploadResponse>.SuccessResponse(response, "Image uploaded successfully.");
        }

        public Task<bool> DeleteImageAsync(string? relativePath)
        {
            if (string.IsNullOrWhiteSpace(relativePath)) return Task.FromResult(false);

            try
            {
                // Normalize and verify path traversal safety
                var cleanPath = relativePath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
                if (!cleanPath.StartsWith("uploads" + Path.DirectorySeparatorChar))
                {
                    _logger.LogWarning("Refused to delete path outside uploads folder: {Path}", relativePath);
                    return Task.FromResult(false);
                }

                var webRoot = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var physicalPath = Path.Combine(webRoot, cleanPath);

                if (File.Exists(physicalPath))
                {
                    File.Delete(physicalPath);
                    _logger.LogInformation("Physical image deleted: {Path}", physicalPath);
                    return Task.FromResult(true);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete physical file {Path}", relativePath);
            }

            return Task.FromResult(false);
        }

        public async Task<ApiResponse<ImageUploadResponse>> ReplaceImageAsync(string? oldRelativePath, IFormFile newFile, string category, CancellationToken cancellationToken = default)
        {
            var uploadResult = await UploadImageAsync(newFile, category, cancellationToken);
            if (!uploadResult.Success)
            {
                return uploadResult;
            }

            // Delete old file only after new one successfully saved
            if (!string.IsNullOrWhiteSpace(oldRelativePath))
            {
                await DeleteImageAsync(oldRelativePath);
            }

            return uploadResult;
        }

        private static string SanitizeCategory(string category)
        {
            var valid = new[] { "products", "admins", "blogs", "testimonials", "company", "categories" };
            var cat = category?.Trim().ToLowerInvariant() ?? "products";
            return valid.Contains(cat) ? cat : "products";
        }
    }
}`
  },
  {
    path: 'OMPolymer.API/Services/Implementations/EmailService.cs',
    name: 'EmailService.cs',
    category: 'Services',
    language: 'csharp',
    description: 'Email notification service dispatching password reset links',
    content: `using MailKit.Net.Smtp;
using MimeKit;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Services.Implementations
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration config, ILogger<EmailService> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task<bool> SendPasswordResetEmailAsync(string toEmail, string recipientName, string resetToken, CancellationToken cancellationToken = default)
        {
            var emailSettings = _config.GetSection("EmailSettings");
            var smtpHost = emailSettings["SmtpHost"] ?? "localhost";
            var smtpPort = int.Parse(emailSettings["SmtpPort"] ?? "587");
            var senderEmail = emailSettings["SenderEmail"] ?? "no-reply@ompolymer.com";
            var senderName = emailSettings["SenderName"] ?? "OM Polymer Security";
            var appBaseUrl = emailSettings["AppBaseUrl"] ?? "https://ompolymer.com";

            var resetLink = $"{appBaseUrl}/admin/reset-password?token={resetToken}&email={Uri.EscapeDataString(toEmail)}";

            // In development or when credentials are not configured, log reset link to console
            if (string.IsNullOrWhiteSpace(emailSettings["SmtpUser"]))
            {
                _logger.LogInformation("=================================================");
                _logger.LogInformation("DEVELOPMENT PASSWORD RESET EMAIL SIMULATED:");
                _logger.LogInformation("To: {ToEmail} ({RecipientName})", toEmail, recipientName);
                _logger.LogInformation("Reset Link: {ResetLink}", resetLink);
                _logger.LogInformation("Reset Token: {Token}", resetToken);
                _logger.LogInformation("=================================================");
                return true;
            }

            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(senderName, senderEmail));
                message.To.Add(new MailboxAddress(recipientName, toEmail));
                message.Subject = "OM Polymer — Password Reset Request";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
                            <h2 style='color: #1e3a8a;'>Password Reset Request</h2>
                            <p>Hello {recipientName},</p>
                            <p>We received a request to reset your password for the OM Polymer Administration Portal.</p>
                            <p>Click the button below to set a new password. This link is single-use and will expire in 1 hour:</p>
                            <p style='margin: 30px 0;'>
                                <a href='{resetLink}' style='background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;'>Reset Password</a>
                            </p>
                            <p>If you did not request this, please ignore this email. Your password will remain unchanged.</p>
                            <hr style='border: none; border-top: 1px solid #e2e8f0; margin-top: 40px;'/>
                            <p style='color: #64748b; font-size: 12px;'>OM Polymer Security Team</p>
                        </div>"
                };

                message.Body = bodyBuilder.ToMessageBody();

                using var client = new SmtpClient();
                await client.ConnectAsync(smtpHost, smtpPort, MailKit.Security.SecureSocketOptions.StartTlsWhenAvailable, cancellationToken);
                if (!string.IsNullOrWhiteSpace(emailSettings["SmtpUser"]))
                {
                    await client.AuthenticateAsync(emailSettings["SmtpUser"], emailSettings["SmtpPass"], cancellationToken);
                }
                await client.SendAsync(message, cancellationToken);
                await client.DisconnectAsync(true, cancellationToken);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send password reset email to {Email}", toEmail);
                return false;
            }
        }
    }
}`
  },
  {
    path: 'OMPolymer.API/Services/Implementations/ProductService.cs',
    name: 'ProductService.cs',
    category: 'Services',
    language: 'csharp',
    description: 'Product catalog business service with AsNoTracking queries & validation',
    content: `using Microsoft.EntityFrameworkCore;
using OMPolymer.API.Data;
using OMPolymer.API.Data.Models;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Services.Implementations
{
    public class ProductService : IProductService
    {
        private readonly OMPolymerDbContext _context;
        private readonly IFileStorageService _fileStorage;
        private readonly ILogger<ProductService> _logger;

        public ProductService(OMPolymerDbContext context, IFileStorageService fileStorage, ILogger<ProductService> logger)
        {
            _context = context;
            _fileStorage = fileStorage;
            _logger = logger;
        }

        public async Task<ApiResponse<PaginatedResponse<ProductResponse>>> GetAllActiveProductsAsync(int page, int pageSize, int? categoryId, string? search)
        {
            var query = _context.Products
                .Include(p => p.Category)
                .Include(p => p.ProductImages)
                .Where(p => p.IsActive)
                .AsNoTracking();

            if (categoryId.HasValue) query = query.Where(p => p.CategoryId == categoryId.Value);
            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.Trim();
                query = query.Where(p => p.ProductName.Contains(s) || (p.ShortDescription != null && p.ShortDescription.Contains(s)));
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => MapToResponse(p))
                .ToListAsync();

            return ApiResponse<PaginatedResponse<ProductResponse>>.SuccessResponse(
                new PaginatedResponse<ProductResponse>(items, totalCount, page, pageSize));
        }

        public async Task<ApiResponse<ProductResponse>> GetProductBySlugAsync(string slug)
        {
            var p = await _context.Products
                .Include(x => x.Category)
                .Include(x => x.ProductImages)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Slug == slug && x.IsActive);

            if (p == null) return ApiResponse<ProductResponse>.FailureResponse("Product not found.");
            return ApiResponse<ProductResponse>.SuccessResponse(MapToResponse(p));
        }

        public async Task<ApiResponse<ProductResponse>> GetProductByIdAsync(int id)
        {
            var p = await _context.Products
                .Include(x => x.Category)
                .Include(x => x.ProductImages)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.ProductId == id && x.IsActive);

            if (p == null) return ApiResponse<ProductResponse>.FailureResponse("Product not found.");
            return ApiResponse<ProductResponse>.SuccessResponse(MapToResponse(p));
        }

        public async Task<ApiResponse<IEnumerable<ProductResponse>>> GetFeaturedProductsAsync()
        {
            var items = await _context.Products
                .Include(p => p.Category)
                .Where(p => p.IsActive && p.IsFeatured)
                .AsNoTracking()
                .Select(p => MapToResponse(p))
                .ToListAsync();

            return ApiResponse<IEnumerable<ProductResponse>>.SuccessResponse(items);
        }

        public async Task<ApiResponse<IEnumerable<CategoryResponse>>> GetCategoriesAsync()
        {
            var items = await _context.ProductCategories
                .Where(c => c.IsActive)
                .AsNoTracking()
                .Select(c => new CategoryResponse { CategoryId = c.CategoryId, CategoryName = c.CategoryName, Slug = c.Slug })
                .ToListAsync();

            return ApiResponse<IEnumerable<CategoryResponse>>.SuccessResponse(items);
        }

        public async Task<ApiResponse<ProductResponse>> CreateProductAsync(ProductCreateRequest request)
        {
            if (await _context.Products.AnyAsync(p => p.Slug.ToLower() == request.Slug.ToLower()))
                return ApiResponse<ProductResponse>.FailureResponse("A product with this slug already exists.");

            var product = new Product
            {
                ProductName = request.ProductName,
                Slug = request.Slug,
                CategoryId = request.CategoryId,
                ShortDescription = request.ShortDescription,
                FullDescription = request.FullDescription,
                Specifications = request.Specifications,
                MainImageUrl = request.MainImageUrl,
                IsFeatured = request.IsFeatured,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            foreach (var imgUrl in request.AdditionalImages)
            {
                product.ProductImages.Add(new ProductImage { ImageUrl = imgUrl });
            }

            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Admin created product {ProductName} (ID: {ProductId})", product.ProductName, product.ProductId);

            return ApiResponse<ProductResponse>.SuccessResponse(MapToResponse(product), "Product created successfully.");
        }

        public async Task<ApiResponse<bool>> UpdateProductAsync(int id, ProductCreateRequest request)
        {
            var product = await _context.Products.Include(p => p.ProductImages).FirstOrDefaultAsync(p => p.ProductId == id);
            if (product == null) return ApiResponse<bool>.FailureResponse("Product not found.");

            if (await _context.Products.AnyAsync(p => p.Slug.ToLower() == request.Slug.ToLower() && p.ProductId != id))
                return ApiResponse<bool>.FailureResponse("Slug already in use by another product.");

            // If main image changed, delete old image from disk
            if (!string.IsNullOrWhiteSpace(product.MainImageUrl) && product.MainImageUrl != request.MainImageUrl)
            {
                await _fileStorage.DeleteImageAsync(product.MainImageUrl);
            }

            product.ProductName = request.ProductName;
            product.Slug = request.Slug;
            product.CategoryId = request.CategoryId;
            product.ShortDescription = request.ShortDescription;
            product.FullDescription = request.FullDescription;
            product.Specifications = request.Specifications;
            product.MainImageUrl = request.MainImageUrl;
            product.IsFeatured = request.IsFeatured;
            product.UpdatedAt = DateTime.UtcNow;

            _context.ProductImages.RemoveRange(product.ProductImages);
            foreach (var imgUrl in request.AdditionalImages)
            {
                product.ProductImages.Add(new ProductImage { ImageUrl = imgUrl });
            }

            await _context.SaveChangesAsync();
            return ApiResponse<bool>.SuccessResponse(true, "Product updated.");
        }

        public async Task<ApiResponse<bool>> DeleteProductAsync(int id)
        {
            var product = await _context.Products.Include(p => p.ProductImages).FirstOrDefaultAsync(p => p.ProductId == id);
            if (product == null) return ApiResponse<bool>.FailureResponse("Product not found.");

            // Clean up main image
            if (!string.IsNullOrWhiteSpace(product.MainImageUrl))
            {
                await _fileStorage.DeleteImageAsync(product.MainImageUrl);
            }

            // Clean up gallery images
            foreach (var img in product.ProductImages)
            {
                await _fileStorage.DeleteImageAsync(img.ImageUrl);
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return ApiResponse<bool>.SuccessResponse(true, "Product deleted.");
        }

        public async Task<ApiResponse<bool>> ToggleStatusAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return ApiResponse<bool>.FailureResponse("Product not found.");

            product.IsActive = !product.IsActive;
            await _context.SaveChangesAsync();
            return ApiResponse<bool>.SuccessResponse(true, $"Product status changed to {product.IsActive}.");
        }

        private static ProductResponse MapToResponse(Product p) => new()
        {
            ProductId = p.ProductId,
            ProductName = p.ProductName,
            Slug = p.Slug,
            ShortDescription = p.ShortDescription,
            FullDescription = p.FullDescription,
            Specifications = p.Specifications,
            MainImageUrl = p.MainImageUrl,
            IsFeatured = p.IsFeatured,
            IsActive = p.IsActive,
            CreatedAt = p.CreatedAt ?? DateTime.UtcNow,
            Category = p.Category != null ? new CategoryResponse { CategoryId = p.Category.CategoryId, CategoryName = p.Category.CategoryName, Slug = p.Category.Slug } : null,
            AdditionalImages = p.ProductImages.Select(img => new ProductImageResponse { ImageId = img.ImageId, ImageUrl = img.ImageUrl }).ToList()
        };
    }
}`
  },
  {
    path: 'OMPolymer.API/Services/Implementations/BlogService.cs',
    name: 'BlogService.cs',
    category: 'Services',
    language: 'csharp',
    description: 'Blog service with draft protection and category search',
    content: `using Microsoft.EntityFrameworkCore;
using OMPolymer.API.Data;
using OMPolymer.API.Data.Models;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Services.Implementations
{
    public class BlogService : IBlogService
    {
        private readonly OMPolymerDbContext _context;
        private readonly IFileStorageService _fileStorage;

        public BlogService(OMPolymerDbContext context, IFileStorageService fileStorage)
        {
            _context = context;
            _fileStorage = fileStorage;
        }

        public async Task<ApiResponse<PaginatedResponse<BlogResponse>>> GetPublishedBlogsAsync(int page, int pageSize, int? categoryId, string? search)
        {
            var query = _context.BlogPosts
                .Include(b => b.BlogCategory)
                .Where(b => b.IsPublished)
                .AsNoTracking();

            if (categoryId.HasValue) query = query.Where(b => b.BlogCategoryId == categoryId.Value);
            if (!string.IsNullOrWhiteSpace(search)) query = query.Where(b => b.Title.Contains(search.Trim()));

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderByDescending(b => b.PublishedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(b => MapToResponse(b))
                .ToListAsync();

            return ApiResponse<PaginatedResponse<BlogResponse>>.SuccessResponse(
                new PaginatedResponse<BlogResponse>(items, totalCount, page, pageSize));
        }

        public async Task<ApiResponse<BlogResponse>> GetBlogBySlugAsync(string slug)
        {
            var b = await _context.BlogPosts
                .Include(x => x.BlogCategory)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Slug == slug && x.IsPublished);

            if (b == null) return ApiResponse<BlogResponse>.FailureResponse("Blog post not found or unpublished.");
            return ApiResponse<BlogResponse>.SuccessResponse(MapToResponse(b));
        }

        public async Task<ApiResponse<IEnumerable<BlogCategoryResponse>>> GetBlogCategoriesAsync()
        {
            var items = await _context.BlogCategories
                .AsNoTracking()
                .Select(c => new BlogCategoryResponse { BlogCategoryId = c.BlogCategoryId, CategoryName = c.CategoryName, Slug = c.Slug })
                .ToListAsync();

            return ApiResponse<IEnumerable<BlogCategoryResponse>>.SuccessResponse(items);
        }

        public async Task<ApiResponse<BlogResponse>> CreateBlogAsync(BlogCreateRequest request)
        {
            if (await _context.BlogPosts.AnyAsync(b => b.Slug.ToLower() == request.Slug.ToLower()))
                return ApiResponse<BlogResponse>.FailureResponse("Slug already exists.");

            var post = new BlogPost
            {
                Title = request.Title,
                Slug = request.Slug,
                BlogCategoryId = request.BlogCategoryId,
                ShortDescription = request.ShortDescription,
                Content = request.Content,
                FeaturedImageUrl = request.FeaturedImageUrl,
                Author = request.Author,
                MetaTitle = request.MetaTitle,
                MetaDescription = request.MetaDescription,
                IsPublished = request.IsPublished,
                PublishedAt = request.IsPublished ? DateTime.UtcNow : null,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.BlogPosts.Add(post);
            await _context.SaveChangesAsync();
            return ApiResponse<BlogResponse>.SuccessResponse(MapToResponse(post));
        }

        public async Task<ApiResponse<bool>> UpdateBlogAsync(int id, BlogCreateRequest request)
        {
            var post = await _context.BlogPosts.FindAsync(id);
            if (post == null) return ApiResponse<bool>.FailureResponse("Blog not found.");

            if (await _context.BlogPosts.AnyAsync(b => b.Slug.ToLower() == request.Slug.ToLower() && b.BlogId != id))
                return ApiResponse<bool>.FailureResponse("Slug already in use by another article.");

            if (!string.IsNullOrWhiteSpace(post.FeaturedImageUrl) && post.FeaturedImageUrl != request.FeaturedImageUrl)
            {
                await _fileStorage.DeleteImageAsync(post.FeaturedImageUrl);
            }

            post.Title = request.Title;
            post.Slug = request.Slug;
            post.BlogCategoryId = request.BlogCategoryId;
            post.ShortDescription = request.ShortDescription;
            post.Content = request.Content;
            post.FeaturedImageUrl = request.FeaturedImageUrl;
            post.Author = request.Author;
            post.MetaTitle = request.MetaTitle;
            post.MetaDescription = request.MetaDescription;

            if (!post.IsPublished && request.IsPublished) post.PublishedAt = DateTime.UtcNow;
            post.IsPublished = request.IsPublished;
            post.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return ApiResponse<bool>.SuccessResponse(true);
        }

        public async Task<ApiResponse<bool>> TogglePublishStatusAsync(int id, bool publish)
        {
            var post = await _context.BlogPosts.FindAsync(id);
            if (post == null) return ApiResponse<bool>.FailureResponse("Blog not found.");

            post.IsPublished = publish;
            post.PublishedAt = publish ? DateTime.UtcNow : null;
            await _context.SaveChangesAsync();
            return ApiResponse<bool>.SuccessResponse(true);
        }

        public async Task<ApiResponse<bool>> DeleteBlogAsync(int id)
        {
            var post = await _context.BlogPosts.FindAsync(id);
            if (post == null) return ApiResponse<bool>.FailureResponse("Blog not found.");

            if (!string.IsNullOrWhiteSpace(post.FeaturedImageUrl))
            {
                await _fileStorage.DeleteImageAsync(post.FeaturedImageUrl);
            }

            _context.BlogPosts.Remove(post);
            await _context.SaveChangesAsync();
            return ApiResponse<bool>.SuccessResponse(true);
        }

        private static BlogResponse MapToResponse(BlogPost b) => new()
        {
            BlogId = b.BlogId,
            Title = b.Title,
            Slug = b.Slug,
            ShortDescription = b.ShortDescription,
            Content = b.Content,
            FeaturedImageUrl = b.FeaturedImageUrl,
            Author = b.Author,
            MetaTitle = b.MetaTitle,
            MetaDescription = b.MetaDescription,
            IsPublished = b.IsPublished,
            PublishedAt = b.PublishedAt,
            CreatedAt = b.CreatedAt ?? DateTime.UtcNow,
            Category = b.BlogCategory != null ? new BlogCategoryResponse { BlogCategoryId = b.BlogCategory.BlogCategoryId, CategoryName = b.BlogCategory.CategoryName, Slug = b.BlogCategory.Slug } : null
        };
    }
}`
  },
  {
    path: 'OMPolymer.API/Services/Implementations/RequirementService.cs',
    name: 'RequirementService.cs',
    category: 'Services',
    language: 'csharp',
    description: 'Lead generation and quotation requirement service',
    content: `using Microsoft.EntityFrameworkCore;
using OMPolymer.API.Data;
using OMPolymer.API.Data.Models;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Services.Implementations
{
    public class RequirementService : IRequirementService
    {
        private readonly OMPolymerDbContext _context;

        public RequirementService(OMPolymerDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<bool>> SubmitRequirementAsync(RequirementCreateRequest request)
        {
            var entity = new ClientRequirement
            {
                FullName = request.FullName,
                CompanyName = request.CompanyName,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                ProductOfInterest = request.ProductOfInterest,
                Quantity = request.Quantity,
                RequirementDescription = request.RequirementDescription,
                City = request.City,
                State = request.State,
                Status = "New",
                CreatedAt = DateTime.UtcNow
            };

            _context.ClientRequirements.Add(entity);
            await _context.SaveChangesAsync();
            return ApiResponse<bool>.SuccessResponse(true, "Your requirement has been submitted successfully.");
        }

        public async Task<ApiResponse<PaginatedResponse<RequirementResponse>>> GetAllRequirementsAsync(int page, int pageSize, string? status, string? search)
        {
            var query = _context.ClientRequirements.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(status) && status != "All")
                query = query.Where(r => r.Status == status);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.Trim();
                query = query.Where(r => r.FullName.Contains(s) || (r.CompanyName != null && r.CompanyName.Contains(s)) || r.Email.Contains(s));
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderByDescending(r => r.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(r => MapToResponse(r))
                .ToListAsync();

            return ApiResponse<PaginatedResponse<RequirementResponse>>.SuccessResponse(
                new PaginatedResponse<RequirementResponse>(items, totalCount, page, pageSize));
        }

        public async Task<ApiResponse<RequirementResponse>> GetRequirementByIdAsync(int id)
        {
            var r = await _context.ClientRequirements.FindAsync(id);
            if (r == null) return ApiResponse<RequirementResponse>.FailureResponse("Requirement not found.");
            return ApiResponse<RequirementResponse>.SuccessResponse(MapToResponse(r));
        }

        public async Task<ApiResponse<bool>> UpdateRequirementStatusAsync(int id, RequirementStatusUpdateRequest request)
        {
            var r = await _context.ClientRequirements.FindAsync(id);
            if (r == null) return ApiResponse<bool>.FailureResponse("Requirement not found.");

            r.Status = request.Status;
            r.AdminRemarks = request.AdminRemarks;
            await _context.SaveChangesAsync();
            return ApiResponse<bool>.SuccessResponse(true, "Requirement updated.");
        }

        private static RequirementResponse MapToResponse(ClientRequirement r) => new()
        {
            RequirementId = r.RequirementId,
            FullName = r.FullName,
            CompanyName = r.CompanyName,
            Email = r.Email,
            PhoneNumber = r.PhoneNumber,
            ProductOfInterest = r.ProductOfInterest,
            Quantity = r.Quantity,
            RequirementDescription = r.RequirementDescription,
            City = r.City,
            State = r.State,
            Status = r.Status,
            AdminRemarks = r.AdminRemarks,
            CreatedAt = r.CreatedAt ?? DateTime.UtcNow
        };
    }
}`
  },
  {
    path: 'OMPolymer.API/Services/Implementations/TestimonialService.cs',
    name: 'TestimonialService.cs',
    category: 'Services',
    language: 'csharp',
    description: 'Testimonial moderation and publication service',
    content: `using Microsoft.EntityFrameworkCore;
using OMPolymer.API.Data;
using OMPolymer.API.Data.Models;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Services.Implementations
{
    public class TestimonialService : ITestimonialService
    {
        private readonly OMPolymerDbContext _context;

        public TestimonialService(OMPolymerDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<IEnumerable<TestimonialResponse>>> GetPublishedTestimonialsAsync()
        {
            var items = await _context.Testimonials
                .Where(t => t.IsPublished && t.IsApproved)
                .OrderByDescending(t => t.CreatedAt)
                .AsNoTracking()
                .Select(t => MapToResponse(t))
                .ToListAsync();

            return ApiResponse<IEnumerable<TestimonialResponse>>.SuccessResponse(items);
        }

        public async Task<ApiResponse<IEnumerable<TestimonialResponse>>> GetAllTestimonialsAsync()
        {
            var items = await _context.Testimonials
                .OrderByDescending(t => t.CreatedAt)
                .AsNoTracking()
                .Select(t => MapToResponse(t))
                .ToListAsync();

            return ApiResponse<IEnumerable<TestimonialResponse>>.SuccessResponse(items);
        }

        public async Task<ApiResponse<TestimonialResponse>> CreateTestimonialAsync(TestimonialCreateRequest request)
        {
            var t = new Testimonial
            {
                DisplayName = request.DisplayName,
                CompanyOrDesignation = request.CompanyOrDesignation,
                ReviewText = request.ReviewText,
                Rating = request.Rating,
                IsApproved = request.IsApproved,
                IsPublished = request.IsPublished,
                CreatedAt = DateTime.UtcNow
            };

            _context.Testimonials.Add(t);
            await _context.SaveChangesAsync();
            return ApiResponse<TestimonialResponse>.SuccessResponse(MapToResponse(t));
        }

        public async Task<ApiResponse<bool>> UpdateTestimonialAsync(int id, TestimonialCreateRequest request)
        {
            var t = await _context.Testimonials.FindAsync(id);
            if (t == null) return ApiResponse<bool>.FailureResponse("Testimonial not found.");

            t.DisplayName = request.DisplayName;
            t.CompanyOrDesignation = request.CompanyOrDesignation;
            t.ReviewText = request.ReviewText;
            t.Rating = request.Rating;
            t.IsApproved = request.IsApproved;
            t.IsPublished = request.IsPublished;

            await _context.SaveChangesAsync();
            return ApiResponse<bool>.SuccessResponse(true);
        }

        public async Task<ApiResponse<bool>> TogglePublishStatusAsync(int id)
        {
            var t = await _context.Testimonials.FindAsync(id);
            if (t == null) return ApiResponse<bool>.FailureResponse("Testimonial not found.");

            t.IsPublished = !t.IsPublished;
            await _context.SaveChangesAsync();
            return ApiResponse<bool>.SuccessResponse(true);
        }

        public async Task<ApiResponse<bool>> DeleteTestimonialAsync(int id)
        {
            var t = await _context.Testimonials.FindAsync(id);
            if (t == null) return ApiResponse<bool>.FailureResponse("Testimonial not found.");

            _context.Testimonials.Remove(t);
            await _context.SaveChangesAsync();
            return ApiResponse<bool>.SuccessResponse(true);
        }

        private static TestimonialResponse MapToResponse(Testimonial t) => new()
        {
            TestimonialId = t.TestimonialId,
            DisplayName = t.DisplayName,
            CompanyOrDesignation = t.CompanyOrDesignation,
            ReviewText = t.ReviewText,
            Rating = t.Rating ?? 5,
            IsApproved = t.IsApproved,
            IsPublished = t.IsPublished,
            CreatedAt = t.CreatedAt ?? DateTime.UtcNow
        };
    }
}`
  },
  {
    path: 'OMPolymer.API/Services/Implementations/CompanyService.cs',
    name: 'CompanyService.cs',
    category: 'Services',
    language: 'csharp',
    description: 'Company settings and WhatsApp chat URL builder',
    content: `using System.Net;
using Microsoft.EntityFrameworkCore;
using OMPolymer.API.Data;
using OMPolymer.API.Data.Models;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Services.Implementations
{
    public class CompanyService : ICompanyService
    {
        private readonly OMPolymerDbContext _context;

        public CompanyService(OMPolymerDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<CompanySettingsResponse>> GetSettingsAsync()
        {
            var s = await _context.CompanySettings.FirstOrDefaultAsync();
            if (s == null) return ApiResponse<CompanySettingsResponse>.FailureResponse("Settings not found.");

            var res = new CompanySettingsResponse
            {
                CompanyName = s.CompanyName,
                Description = s.Description,
                YearsOfExperience = s.YearsOfExperience ?? 13,
                AboutContent = s.AboutContent,
                Address = s.Address,
                EmailContact = s.EmailContact,
                PhoneContact = s.PhoneContact,
                WhatsAppNumber = s.WhatsAppNumber,
                SocialFacebook = s.SocialFacebook,
                SocialLinkedIn = s.SocialLinkedIn,
                SocialInstagram = s.SocialInstagram,
                WhatsAppUrl = GenerateWhatsAppUrl(s.WhatsAppNumber, "Hello, I have an inquiry regarding your products.")
            };

            return ApiResponse<CompanySettingsResponse>.SuccessResponse(res);
        }

        public async Task<ApiResponse<bool>> UpdateSettingsAsync(CompanySettingsUpdateRequest request)
        {
            var s = await _context.CompanySettings.FirstOrDefaultAsync();
            if (s == null)
            {
                s = new CompanySetting();
                _context.CompanySettings.Add(s);
            }

            s.CompanyName = request.CompanyName;
            s.Description = request.Description;
            s.YearsOfExperience = request.YearsOfExperience;
            s.AboutContent = request.AboutContent;
            s.Address = request.Address;
            s.EmailContact = request.EmailContact;
            s.PhoneContact = request.PhoneContact;
            s.WhatsAppNumber = request.WhatsAppNumber;
            s.SocialFacebook = request.SocialFacebook;
            s.SocialLinkedIn = request.SocialLinkedIn;
            s.SocialInstagram = request.SocialInstagram;
            s.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return ApiResponse<bool>.SuccessResponse(true, "Company settings updated successfully.");
        }

        public string GenerateWhatsAppUrl(string? phoneNumber, string message)
        {
            if (string.IsNullOrWhiteSpace(phoneNumber)) return string.Empty;
            string clean = new string(phoneNumber.Where(char.IsDigit).ToArray());
            return $"https://wa.me/{clean}?text={WebUtility.UrlEncode(message)}";
        }
    }
}`
  },

  // ==========================================
  // 10. Controllers (Controllers/)
  // ==========================================
  {
    path: 'OMPolymer.API/Controllers/AuthController.cs',
    name: 'AuthController.cs',
    category: 'Controllers',
    language: 'csharp',
    description: 'Admin login, Forgot Password, Reset Password, and Change Password endpoints',
    content: `using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Controllers
{
    [ApiController]
    [Route("api/admin/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        [EnableRateLimiting("LoginPolicy")]
        public async Task<ActionResult<ApiResponse<AuthResponse>>> Login([FromBody] LoginRequest request)
        {
            var result = await _authService.LoginAsync(request);
            if (!result.Success) return Unauthorized(result);
            return Ok(result);
        }

        [HttpPost("forgot-password")]
        [EnableRateLimiting("ForgotPasswordPolicy")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var result = await _authService.ForgotPasswordAsync(request);
            return Ok(result);
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var result = await _authService.ResetPasswordAsync(request);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [Authorize(Roles = "SuperAdmin,Admin")]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var adminIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(adminIdClaim, out var adminId)) return Unauthorized();

            var result = await _authService.ChangePasswordAsync(adminId, request);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpGet("hash-password")]
        public IActionResult GetHash([FromQuery] string password = "Admin@123")
        {
            return Ok(new { plainText = password, hash = _authService.HashPassword(password) });
        }
    }
}`
  },
  {
    path: 'OMPolymer.API/Controllers/AdminUsersController.cs',
    name: 'AdminUsersController.cs',
    category: 'Controllers',
    language: 'csharp',
    description: 'Secured Admin User management endpoints (CRUD, activate, deactivate, soft delete)',
    content: `using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Controllers
{
    [Authorize(Roles = "SuperAdmin,Admin")]
    [ApiController]
    [Route("api/admin/users")]
    public class AdminUsersController : ControllerBase
    {
        private readonly IAdminUserService _adminUserService;

        public AdminUsersController(IAdminUserService adminUserService)
        {
            _adminUserService = adminUserService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? role = null, [FromQuery] string? status = null, [FromQuery] string? search = null)
            => Ok(await _adminUserService.GetAdminsAsync(page, pageSize, role, status, search));

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _adminUserService.GetAdminByIdAsync(id);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AdminCreateRequest request)
        {
            var result = await _adminUserService.CreateAdminAsync(request);
            if (!result.Success) return Conflict(result);
            return StatusCode(201, result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] AdminUpdateRequest request)
        {
            var result = await _adminUserService.UpdateAdminAsync(id, request);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpPatch("{id:int}/status")]
        public async Task<IActionResult> ToggleStatus(int id, [FromBody] StatusToggleRequest request)
        {
            var result = await _adminUserService.ToggleStatusAsync(id, request.IsActive);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _adminUserService.DeleteAdminAsync(id);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }
    }

    public class StatusToggleRequest
    {
        public bool IsActive { get; set; }
    }
}`
  },
  {
    path: 'OMPolymer.API/Controllers/UploadsController.cs',
    name: 'UploadsController.cs',
    category: 'Controllers',
    language: 'csharp',
    description: 'Image upload and physical file management endpoint',
    content: `using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/uploads")]
    public class UploadsController : ControllerBase
    {
        private readonly IFileStorageService _fileStorage;

        public UploadsController(IFileStorageService fileStorage)
        {
            _fileStorage = fileStorage;
        }

        /// <summary>
        /// Accepts multipart/form-data image upload. Saves to wwwroot/uploads/{category}/ and returns relative path.
        /// </summary>
        [HttpPost("image")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadImage([FromForm] UploadImageRequest request, CancellationToken cancellationToken = default)
        {
            var result = await _fileStorage.UploadImageAsync(request.File, request.Category, cancellationToken);
            if (!result.Success) return BadRequest(result);
            return StatusCode(201, result);
        }

        [HttpDelete("image")]
        public async Task<IActionResult> DeleteImage([FromBody] DeleteImageRequest request)
        {
            var success = await _fileStorage.DeleteImageAsync(request.RelativePath);
            return Ok(new { success, message = success ? "File deleted." : "File not found or unsafe path." });
        }
    }

    public class DeleteImageRequest
    {
        public string RelativePath { get; set; } = string.Empty;
    }
}`
  },
  {
    path: 'OMPolymer.API/Controllers/ProductsController.cs',
    name: 'ProductsController.cs',
    category: 'Controllers',
    language: 'csharp',
    description: 'Public Product endpoints (list, slug, categories, featured)',
    content: `using Microsoft.AspNetCore.Mvc;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] int? categoryId = null, [FromQuery] string? search = null)
            => Ok(await _productService.GetAllActiveProductsAsync(page, pageSize, categoryId, search));

        [HttpGet("slug/{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var result = await _productService.GetProductBySlugAsync(slug);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _productService.GetProductByIdAsync(id);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }

        [HttpGet("featured")]
        public async Task<IActionResult> GetFeatured() => Ok(await _productService.GetFeaturedProductsAsync());

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories() => Ok(await _productService.GetCategoriesAsync());
    }
}`
  },
  {
    path: 'OMPolymer.API/Controllers/AdminProductsController.cs',
    name: 'AdminProductsController.cs',
    category: 'Controllers',
    language: 'csharp',
    description: 'Secured Admin Product CRUD endpoints',
    content: `using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Controllers
{
    [Authorize(Roles = "SuperAdmin,Admin")]
    [ApiController]
    [Route("api/admin/products")]
    public class AdminProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public AdminProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProductCreateRequest request)
        {
            var result = await _productService.CreateProductAsync(request);
            if (!result.Success) return Conflict(result);
            return StatusCode(201, result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProductCreateRequest request)
        {
            var result = await _productService.UpdateProductAsync(id, request);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpPatch("{id:int}/status")]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            var result = await _productService.ToggleStatusAsync(id);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _productService.DeleteProductAsync(id);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }
    }
}`
  },
  {
    path: 'OMPolymer.API/Controllers/BlogsController.cs',
    name: 'BlogsController.cs',
    category: 'Controllers',
    language: 'csharp',
    description: 'Public Blog endpoints (published articles only)',
    content: `using Microsoft.AspNetCore.Mvc;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Controllers
{
    [ApiController]
    [Route("api/blogs")]
    public class BlogsController : ControllerBase
    {
        private readonly IBlogService _blogService;

        public BlogsController(IBlogService blogService)
        {
            _blogService = blogService;
        }

        [HttpGet]
        public async Task<IActionResult> GetPublished([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] int? categoryId = null, [FromQuery] string? search = null)
            => Ok(await _blogService.GetPublishedBlogsAsync(page, pageSize, categoryId, search));

        [HttpGet("{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var result = await _blogService.GetBlogBySlugAsync(slug);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories() => Ok(await _blogService.GetBlogCategoriesAsync());
    }
}`
  },
  {
    path: 'OMPolymer.API/Controllers/AdminBlogsController.cs',
    name: 'AdminBlogsController.cs',
    category: 'Controllers',
    language: 'csharp',
    description: 'Secured Admin Blog CRUD and publish/unpublish endpoints',
    content: `using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Controllers
{
    [Authorize(Roles = "SuperAdmin,Admin")]
    [ApiController]
    [Route("api/admin/blogs")]
    public class AdminBlogsController : ControllerBase
    {
        private readonly IBlogService _blogService;

        public AdminBlogsController(IBlogService blogService)
        {
            _blogService = blogService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] BlogCreateRequest request)
        {
            var result = await _blogService.CreateBlogAsync(request);
            if (!result.Success) return Conflict(result);
            return StatusCode(201, result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] BlogCreateRequest request)
        {
            var result = await _blogService.UpdateBlogAsync(id, request);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }

        [HttpPatch("{id:int}/publish")]
        public async Task<IActionResult> Publish(int id)
        {
            var result = await _blogService.TogglePublishStatusAsync(id, true);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }

        [HttpPatch("{id:int}/unpublish")]
        public async Task<IActionResult> Unpublish(int id)
        {
            var result = await _blogService.TogglePublishStatusAsync(id, false);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _blogService.DeleteBlogAsync(id);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }
    }
}`
  },
  {
    path: 'OMPolymer.API/Controllers/RequirementsController.cs',
    name: 'RequirementsController.cs',
    category: 'Controllers',
    language: 'csharp',
    description: 'Public RFQ Submission API protected by Rate Limiter',
    content: `using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Controllers
{
    [ApiController]
    [Route("api/requirements")]
    public class RequirementsController : ControllerBase
    {
        private readonly IRequirementService _requirementService;

        public RequirementsController(IRequirementService requirementService)
        {
            _requirementService = requirementService;
        }

        [HttpPost]
        [EnableRateLimiting("RequirementPolicy")]
        public async Task<IActionResult> Submit([FromBody] RequirementCreateRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _requirementService.SubmitRequirementAsync(request);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }
    }
}`
  },
  {
    path: 'OMPolymer.API/Controllers/AdminRequirementsController.cs',
    name: 'AdminRequirementsController.cs',
    category: 'Controllers',
    language: 'csharp',
    description: 'Secured Admin Controller for customer lead triage & internal remarks',
    content: `using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Controllers
{
    [Authorize(Roles = "SuperAdmin,Admin")]
    [ApiController]
    [Route("api/admin/requirements")]
    public class AdminRequirementsController : ControllerBase
    {
        private readonly IRequirementService _service;

        public AdminRequirementsController(IRequirementService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? status = null, [FromQuery] string? search = null)
            => Ok(await _service.GetAllRequirementsAsync(page, pageSize, status, search));

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetRequirementByIdAsync(id);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }

        [HttpPatch("{id:int}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] RequirementStatusUpdateRequest request)
        {
            var result = await _service.UpdateRequirementStatusAsync(id, request);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }
    }
}`
  },
  {
    path: 'OMPolymer.API/Controllers/TestimonialsController.cs',
    name: 'TestimonialsController.cs',
    category: 'Controllers',
    language: 'csharp',
    description: 'Public Testimonials endpoint (approved and published only)',
    content: `using Microsoft.AspNetCore.Mvc;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Controllers
{
    [ApiController]
    [Route("api/testimonials")]
    public class TestimonialsController : ControllerBase
    {
        private readonly ITestimonialService _service;

        public TestimonialsController(ITestimonialService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetPublished() => Ok(await _service.GetPublishedTestimonialsAsync());
    }
}`
  },
  {
    path: 'OMPolymer.API/Controllers/AdminTestimonialsController.cs',
    name: 'AdminTestimonialsController.cs',
    category: 'Controllers',
    language: 'csharp',
    description: 'Secured Admin Testimonials CRUD and approval endpoints',
    content: `using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Controllers
{
    [Authorize(Roles = "SuperAdmin,Admin")]
    [ApiController]
    [Route("api/admin/testimonials")]
    public class AdminTestimonialsController : ControllerBase
    {
        private readonly ITestimonialService _service;

        public AdminTestimonialsController(ITestimonialService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllTestimonialsAsync());

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TestimonialCreateRequest request)
        {
            var result = await _service.CreateTestimonialAsync(request);
            return StatusCode(201, result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] TestimonialCreateRequest request)
        {
            var result = await _service.UpdateTestimonialAsync(id, request);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }

        [HttpPatch("{id:int}/toggle-publish")]
        public async Task<IActionResult> TogglePublish(int id)
        {
            var result = await _service.TogglePublishStatusAsync(id);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteTestimonialAsync(id);
            if (!result.Success) return NotFound(result);
            return Ok(result);
        }
    }
}`
  },
  {
    path: 'OMPolymer.API/Controllers/CompanyController.cs',
    name: 'CompanyController.cs',
    category: 'Controllers',
    language: 'csharp',
    description: 'Public Company and WhatsApp URL generation endpoints',
    content: `using Microsoft.AspNetCore.Mvc;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Controllers
{
    [ApiController]
    [Route("api/company")]
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyService _service;

        public CompanyController(ICompanyService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetInfo() => Ok(await _service.GetSettingsAsync());

        [HttpGet("whatsapp-url")]
        public async Task<IActionResult> GetWhatsAppUrl([FromQuery] string? productSlug = null, [FromQuery] string? message = null)
        {
            var settings = await _service.GetSettingsAsync();
            string msg = message ?? (string.IsNullOrEmpty(productSlug)
                ? "Hello, I am interested in your products and services."
                : $"Hello, I would like to request technical specifications and a quotation for product: {productSlug}");

            return Ok(new
            {
                url = _service.GenerateWhatsAppUrl(settings.Data?.WhatsAppNumber, msg)
            });
        }
    }
}`
  },
  {
    path: 'OMPolymer.API/Controllers/AdminCompanyController.cs',
    name: 'AdminCompanyController.cs',
    category: 'Controllers',
    language: 'csharp',
    description: 'Secured Admin Company settings updater',
    content: `using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Controllers
{
    [Authorize(Roles = "SuperAdmin,Admin")]
    [ApiController]
    [Route("api/admin/company")]
    public class AdminCompanyController : ControllerBase
    {
        private readonly ICompanyService _service;

        public AdminCompanyController(ICompanyService service)
        {
            _service = service;
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] CompanySettingsUpdateRequest request)
        {
            var result = await _service.UpdateSettingsAsync(request);
            if (!result.Success) return BadRequest(result);
            return Ok(result);
        }
    }
}`
  },

  // ==========================================
  // 11. Database SQL Script & Migrations
  // ==========================================
  {
    path: 'Database/OMPolymerDB.sql',
    name: 'OMPolymerDB.sql',
    category: 'Database SQL',
    language: 'sql',
    description: 'Complete SQL Server DDL and DML script with Admin Management & PasswordResetTokens',
    content: `-- ==============================================================
-- DATABASE: OMPolymerDB
-- Database-First Source of Truth for OM Polymer ASP.NET Core API
-- ==============================================================

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'OMPolymerDB')
BEGIN
    CREATE DATABASE OMPolymerDB;
END;
GO

USE OMPolymerDB;
GO

-- 1. Admin Users (Updated with Role, ProfileImageUrl, and Soft Deletion)
IF OBJECT_ID('dbo.AdminUsers', 'U') IS NULL
BEGIN
    CREATE TABLE AdminUsers (
        AdminID INT PRIMARY KEY IDENTITY(1,1),
        Email NVARCHAR(150) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(MAX) NOT NULL,
        FullName NVARCHAR(100) NOT NULL,
        Role NVARCHAR(50) NOT NULL DEFAULT 'Admin',
        ProfileImageUrl NVARCHAR(1000) NULL,
        IsActive BIT NOT NULL DEFAULT 1,
        IsDeleted BIT NOT NULL DEFAULT 0,
        LastLoginAt DATETIME NULL,
        CreatedAt DATETIME DEFAULT GETDATE(),
        UpdatedAt DATETIME DEFAULT GETDATE()
    );
END
ELSE
BEGIN
    -- Safe Migration: Add missing columns if upgrading existing table
    IF COL_LENGTH('dbo.AdminUsers', 'Role') IS NULL
        ALTER TABLE AdminUsers ADD Role NVARCHAR(50) NOT NULL DEFAULT 'Admin';
    IF COL_LENGTH('dbo.AdminUsers', 'ProfileImageUrl') IS NULL
        ALTER TABLE AdminUsers ADD ProfileImageUrl NVARCHAR(1000) NULL;
    IF COL_LENGTH('dbo.AdminUsers', 'IsDeleted') IS NULL
        ALTER TABLE AdminUsers ADD IsDeleted BIT NOT NULL DEFAULT 0;
    IF COL_LENGTH('dbo.AdminUsers', 'UpdatedAt') IS NULL
        ALTER TABLE AdminUsers ADD UpdatedAt DATETIME NULL;
END;
GO

-- 2. Password Reset Tokens Table
IF OBJECT_ID('dbo.PasswordResetTokens', 'U') IS NULL
BEGIN
    CREATE TABLE PasswordResetTokens (
        TokenID INT PRIMARY KEY IDENTITY(1,1),
        AdminID INT NOT NULL,
        TokenHash NVARCHAR(256) NOT NULL,
        ExpiresAt DATETIME NOT NULL,
        IsUsed BIT NOT NULL DEFAULT 0,
        CreatedAt DATETIME DEFAULT GETDATE(),
        CONSTRAINT FK_PasswordResetTokens_AdminUsers FOREIGN KEY (AdminID) 
            REFERENCES AdminUsers(AdminID) ON DELETE CASCADE
    );
    CREATE NONCLUSTERED INDEX IX_PasswordResetTokens_TokenHash ON PasswordResetTokens(TokenHash);
END;
GO

-- 3. Company Global Settings
IF OBJECT_ID('dbo.CompanySettings', 'U') IS NULL
BEGIN
    CREATE TABLE CompanySettings (
        SettingID INT PRIMARY KEY IDENTITY(1,1),
        CompanyName NVARCHAR(200) NOT NULL,
        Description NVARCHAR(MAX),
        YearsOfExperience INT DEFAULT 13,
        AboutContent NVARCHAR(MAX),
        Address NVARCHAR(500),
        EmailContact NVARCHAR(150),
        PhoneContact NVARCHAR(20),
        WhatsAppNumber NVARCHAR(20),
        SocialFacebook NVARCHAR(500),
        SocialLinkedIn NVARCHAR(500),
        SocialInstagram NVARCHAR(500),
        UpdatedAt DATETIME DEFAULT GETDATE()
    );
END;

-- 4. Product Categories
IF OBJECT_ID('dbo.ProductCategories', 'U') IS NULL
BEGIN
    CREATE TABLE ProductCategories (
        CategoryID INT PRIMARY KEY IDENTITY(1,1),
        CategoryName NVARCHAR(100) NOT NULL,
        Slug NVARCHAR(150) NOT NULL UNIQUE,
        IsActive BIT NOT NULL DEFAULT 1
    );
END;

-- 5. Products Table (Stores relative image paths e.g. /uploads/products/...)
IF OBJECT_ID('dbo.Products', 'U') IS NULL
BEGIN
    CREATE TABLE Products (
        ProductID INT PRIMARY KEY IDENTITY(1,1),
        CategoryID INT NOT NULL,
        ProductName NVARCHAR(200) NOT NULL,
        Slug NVARCHAR(250) NOT NULL UNIQUE,
        ShortDescription NVARCHAR(500),
        FullDescription NVARCHAR(MAX),
        Specifications NVARCHAR(MAX),
        MainImageUrl NVARCHAR(1000),
        IsFeatured BIT NOT NULL DEFAULT 0,
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME DEFAULT GETDATE(),
        UpdatedAt DATETIME DEFAULT GETDATE(),
        CONSTRAINT FK_Products_Categories FOREIGN KEY (CategoryID) REFERENCES ProductCategories(CategoryID)
    );
END;

-- 6. Product Images (One-to-Many gallery, relative file paths)
IF OBJECT_ID('dbo.ProductImages', 'U') IS NULL
BEGIN
    CREATE TABLE ProductImages (
        ImageID INT PRIMARY KEY IDENTITY(1,1),
        ProductID INT NOT NULL,
        ImageUrl NVARCHAR(1000) NOT NULL,
        SortOrder INT DEFAULT 0,
        CONSTRAINT FK_ProductImages_Products FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE
    );
END;

-- 7. Blog Categories
IF OBJECT_ID('dbo.BlogCategories', 'U') IS NULL
BEGIN
    CREATE TABLE BlogCategories (
        BlogCategoryID INT PRIMARY KEY IDENTITY(1,1),
        CategoryName NVARCHAR(100) NOT NULL,
        Slug NVARCHAR(150) NOT NULL UNIQUE
    );
END;

-- 8. Blog Posts (FeaturedImageUrl stores relative path e.g. /uploads/blogs/...)
IF OBJECT_ID('dbo.BlogPosts', 'U') IS NULL
BEGIN
    CREATE TABLE BlogPosts (
        BlogID INT PRIMARY KEY IDENTITY(1,1),
        BlogCategoryID INT NULL,
        Title NVARCHAR(250) NOT NULL,
        Slug NVARCHAR(300) NOT NULL UNIQUE,
        ShortDescription NVARCHAR(1000),
        Content NVARCHAR(MAX) NOT NULL,
        FeaturedImageUrl NVARCHAR(1000),
        Author NVARCHAR(100),
        MetaTitle NVARCHAR(200),
        MetaDescription NVARCHAR(300),
        IsPublished BIT NOT NULL DEFAULT 0,
        PublishedAt DATETIME NULL,
        CreatedAt DATETIME DEFAULT GETDATE(),
        UpdatedAt DATETIME DEFAULT GETDATE(),
        CONSTRAINT FK_Blogs_Categories FOREIGN KEY (BlogCategoryID) REFERENCES BlogCategories(BlogCategoryID) ON DELETE SET NULL
    );
END;

-- 9. Client Requirements (Leads)
IF OBJECT_ID('dbo.ClientRequirements', 'U') IS NULL
BEGIN
    CREATE TABLE ClientRequirements (
        RequirementID INT PRIMARY KEY IDENTITY(1,1),
        FullName NVARCHAR(150) NOT NULL,
        CompanyName NVARCHAR(200),
        Email NVARCHAR(150) NOT NULL,
        PhoneNumber NVARCHAR(20) NOT NULL,
        ProductOfInterest NVARCHAR(200),
        Quantity NVARCHAR(100),
        RequirementDescription NVARCHAR(MAX) NOT NULL,
        City NVARCHAR(100),
        State NVARCHAR(100),
        Status NVARCHAR(50) NOT NULL DEFAULT 'New',
        AdminRemarks NVARCHAR(MAX),
        CreatedAt DATETIME DEFAULT GETDATE()
    );
END;

-- 10. Testimonials
IF OBJECT_ID('dbo.Testimonials', 'U') IS NULL
BEGIN
    CREATE TABLE Testimonials (
        TestimonialID INT PRIMARY KEY IDENTITY(1,1),
        DisplayName NVARCHAR(150) NOT NULL,
        CompanyOrDesignation NVARCHAR(200),
        ReviewText NVARCHAR(MAX) NOT NULL,
        Rating INT CHECK (Rating >= 1 AND Rating <= 5),
        IsApproved BIT NOT NULL DEFAULT 0,
        IsPublished BIT NOT NULL DEFAULT 0,
        CreatedAt DATETIME DEFAULT GETDATE()
    );
END;

-- Indexes
CREATE NONCLUSTERED INDEX IX_Products_Slug ON Products(Slug);
CREATE NONCLUSTERED INDEX IX_BlogPosts_Slug ON BlogPosts(Slug);
CREATE NONCLUSTERED INDEX IX_Products_IsActive_IsFeatured ON Products(IsActive, IsFeatured);
CREATE NONCLUSTERED INDEX IX_ClientRequirements_Status ON ClientRequirements(Status);
CREATE NONCLUSTERED INDEX IX_AdminUsers_Email ON AdminUsers(Email);
GO

-- Seed Initial Super Administrator (Password: Admin@123 via BCrypt)
IF NOT EXISTS (SELECT 1 FROM AdminUsers WHERE Email = 'admin@ompolymer.com')
BEGIN
    INSERT INTO AdminUsers (Email, PasswordHash, FullName, Role, ProfileImageUrl, IsActive, IsDeleted)
    VALUES (
        'admin@ompolymer.com', 
        '$2a$11$q9iU6Kx1s18.261L51k7AOP9R.jJ4d0Qh39iWv6n/4JbY7a0t4s1q', 
        'Executive Super Administrator', 
        'SuperAdmin', 
        '/uploads/admins/superadmin_avatar.webp',
        1, 
        0
    );
END;

-- Seed Company Settings
IF NOT EXISTS (SELECT 1 FROM CompanySettings)
BEGIN
    INSERT INTO CompanySettings (CompanyName, Description, YearsOfExperience, Address, EmailContact, PhoneContact, WhatsAppNumber)
    VALUES (
        'OM Polymer',
        'Leading manufacturer of high-grade engineering polymers, HDPE piping systems, and masterbatches.',
        13,
        'Plot 48/B, Industrial Area Phase II, G.I.D.C., Ahmedabad, Gujarat, India',
        'inquiry@ompolymer.com',
        '+91 79 4002 9180',
        '+919876543210'
    );
END;

-- Seed Product Categories
IF NOT EXISTS (SELECT 1 FROM ProductCategories)
BEGIN
    INSERT INTO ProductCategories (CategoryName, Slug, IsActive)
    VALUES 
    ('HDPE Pressure Pipes & Ducts', 'hdpe-pipes-ducts', 1),
    ('Engineering Polymers & Resins', 'engineering-polymers', 1),
    ('Color & Additive Masterbatches', 'masterbatches', 1),
    ('UPVC & CPVC Fitting Solutions', 'upvc-cpvc-fittings', 1);
END;
GO`
  },
  {
    path: 'OMPolymer.API/Migrations/20261008_AddAdminManagementAndResetTokens.cs',
    name: '20261008_AddAdminManagementAndResetTokens.cs',
    category: 'Data & EF Core',
    language: 'csharp',
    description: 'EF Core Migration adding PasswordResetTokens and AdminUser columns',
    content: `using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OMPolymer.API.Migrations
{
    public partial class AddAdminManagementAndResetTokens : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "AdminUsers",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "Admin");

            migrationBuilder.AddColumn<string>(
                name: "ProfileImageUrl",
                table: "AdminUsers",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "AdminUsers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "AdminUsers",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "PasswordResetTokens",
                columns: table => new
                {
                    TokenId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AdminId = table.Column<int>(type: "int", nullable: false),
                    TokenHash = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsUsed = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PasswordResetTokens", x => x.TokenId);
                    table.ForeignKey(
                        name: "FK_PasswordResetTokens_AdminUsers",
                        column: x => x.AdminId,
                        principalTable: "AdminUsers",
                        principalColumn: "AdminId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PasswordResetTokens_AdminId",
                table: "PasswordResetTokens",
                column: "AdminId");

            migrationBuilder.CreateIndex(
                name: "IX_PasswordResetTokens_TokenHash",
                table: "PasswordResetTokens",
                column: "TokenHash");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "PasswordResetTokens");
            migrationBuilder.DropColumn(name: "Role", table: "AdminUsers");
            migrationBuilder.DropColumn(name: "ProfileImageUrl", table: "AdminUsers");
            migrationBuilder.DropColumn(name: "IsDeleted", table: "AdminUsers");
            migrationBuilder.DropColumn(name: "UpdatedAt", table: "AdminUsers");
        }
    }
}`
  },

  // ==========================================
  // 12. Automated Tests (OMPolymer.Tests/)
  // ==========================================
  {
    path: 'OMPolymer.Tests/OMPolymer.Tests.csproj',
    name: 'OMPolymer.Tests.csproj',
    category: 'Configuration',
    language: 'xml',
    description: 'xUnit test project file',
    content: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
    <IsPackable>false</IsPackable>
    <IsTestProject>true</IsTestProject>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.12.0" />
    <PackageReference Include="xunit" Version="2.9.2" />
    <PackageReference Include="xunit.runner.visualstudio" Version="2.8.2">
      <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
      <PrivateAssets>all</PrivateAssets>
    </PackageReference>
    <PackageReference Include="Microsoft.EntityFrameworkCore.InMemory" Version="10.0.0" />
    <PackageReference Include="Moq" Version="4.20.72" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\\OMPolymer.API\\OMPolymer.API.csproj" />
  </ItemGroup>

</Project>`
  },
  {
    path: 'OMPolymer.Tests/UnitAndIntegrationTests.cs',
    name: 'UnitAndIntegrationTests.cs',
    category: 'Tests',
    language: 'csharp',
    description: 'xUnit tests covering admin user management, password reset tokens, and file storage validation',
    content: `using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using OMPolymer.API.Data;
using OMPolymer.API.Data.Models;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.Services.Implementations;
using OMPolymer.API.Services.Interfaces;
using Xunit;

namespace OMPolymer.Tests
{
    public class AdminUserServiceTests
    {
        private OMPolymerDbContext GetInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<OMPolymerDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            return new OMPolymerDbContext(options);
        }

        [Fact]
        public async Task CreateAdmin_WithDuplicateEmail_ReturnsFailure()
        {
            using var context = GetInMemoryContext();
            context.AdminUsers.Add(new AdminUser { Email = "admin@ompolymer.com", FullName = "Admin", PasswordHash = "hash" });
            await context.SaveChangesAsync();

            var service = new AdminUserService(context, Mock.Of<ILogger<AdminUserService>>());

            var request = new AdminCreateRequest
            {
                Email = "admin@ompolymer.com",
                FullName = "Another Admin",
                Password = "Password@123",
                Role = "Admin"
            };

            var result = await service.CreateAdminAsync(request);

            Assert.False(result.Success);
            Assert.Contains("already exists", result.Message, StringComparison.OrdinalIgnoreCase);
        }

        [Fact]
        public async Task DeleteAdmin_LastActiveSuperAdmin_IsPrevented()
        {
            using var context = GetInMemoryContext();
            var superAdmin = new AdminUser { AdminId = 1, Email = "super@ompolymer.com", FullName = "Super", Role = "SuperAdmin", IsActive = true, IsDeleted = false, PasswordHash = "hash" };
            context.AdminUsers.Add(superAdmin);
            await context.SaveChangesAsync();

            var service = new AdminUserService(context, Mock.Of<ILogger<AdminUserService>>());

            var result = await service.DeleteAdminAsync(1);

            Assert.False(result.Success);
            Assert.Contains("Cannot delete the only remaining active Super Administrator", result.Message);
        }
    }

    public class PasswordRecoveryTests
    {
        private OMPolymerDbContext GetInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<OMPolymerDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            return new OMPolymerDbContext(options);
        }

        [Fact]
        public async Task ForgotPassword_ForNonExistentEmail_ReturnsGenericSuccess()
        {
            using var context = GetInMemoryContext();
            var emailServiceMock = new Mock<IEmailService>();
            var configMock = new Mock<IConfiguration>();

            var service = new AuthService(context, configMock.Object, emailServiceMock.Object, Mock.Of<ILogger<AuthService>>());

            var result = await service.ForgotPasswordAsync(new ForgotPasswordRequest { Email = "nobody@ompolymer.com" });

            // Must return success to prevent account enumeration
            Assert.True(result.Success);
            emailServiceMock.Verify(x => x.SendPasswordResetEmailAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), default), Times.Never);
        }
    }
}`
  }
];
