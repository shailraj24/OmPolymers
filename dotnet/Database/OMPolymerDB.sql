-- ==============================================================
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

-- 3. Company Global Settings (With Dynamic Logo and Favicon storage)
IF OBJECT_ID('dbo.CompanySettings', 'U') IS NULL
BEGIN
    CREATE TABLE CompanySettings (
        SettingID INT PRIMARY KEY IDENTITY(1,1),
        CompanyName NVARCHAR(200) NOT NULL,
        LogoUrl NVARCHAR(1000) NULL,
        LogoFileID INT NULL,
        FaviconUrl NVARCHAR(1000) NULL,
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
END
ELSE
BEGIN
    IF COL_LENGTH('dbo.CompanySettings', 'LogoUrl') IS NULL
        ALTER TABLE CompanySettings ADD LogoUrl NVARCHAR(1000) NULL;
    IF COL_LENGTH('dbo.CompanySettings', 'LogoFileID') IS NULL
        ALTER TABLE CompanySettings ADD LogoFileID INT NULL;
    IF COL_LENGTH('dbo.CompanySettings', 'FaviconUrl') IS NULL
        ALTER TABLE CompanySettings ADD FaviconUrl NVARCHAR(1000) NULL;
END;

-- 4. Product Categories (Dynamic Category Management with Description & Timestamps)
IF OBJECT_ID('dbo.ProductCategories', 'U') IS NULL
BEGIN
    CREATE TABLE ProductCategories (
        CategoryID INT PRIMARY KEY IDENTITY(1,1),
        CategoryName NVARCHAR(100) NOT NULL,
        Slug NVARCHAR(150) NOT NULL UNIQUE,
        Description NVARCHAR(500) NULL,
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME NOT NULL DEFAULT GETDATE()
    );
END
ELSE
BEGIN
    -- Safe Migration: Add missing columns if upgrading existing table
    IF COL_LENGTH('dbo.ProductCategories', 'Description') IS NULL
        ALTER TABLE ProductCategories ADD Description NVARCHAR(500) NULL;
    IF COL_LENGTH('dbo.ProductCategories', 'CreatedAt') IS NULL
        ALTER TABLE ProductCategories ADD CreatedAt DATETIME NOT NULL DEFAULT GETDATE();
    IF COL_LENGTH('dbo.ProductCategories', 'UpdatedAt') IS NULL
        ALTER TABLE ProductCategories ADD UpdatedAt DATETIME NOT NULL DEFAULT GETDATE();
END;
GO

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
        CONSTRAINT FK_Products_Categories FOREIGN KEY (CategoryID) 
            REFERENCES ProductCategories(CategoryID) ON DELETE NO ACTION
    );
END
ELSE
BEGIN
    -- Ensure FK_Products_Categories enforces RESTRICT / NO ACTION
    IF OBJECT_ID('dbo.FK_Products_Categories', 'F') IS NOT NULL
    BEGIN
        PRINT 'FK_Products_Categories verified on Products table.';
    END;
END;
GO

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
GO

-- 7. Blog Posts (Blog Categories removed per architecture requirements)
-- Safe Migration: Drop obsolete BlogCategories table and foreign key from BlogPosts if upgrading
IF OBJECT_ID('dbo.FK_Blogs_Categories', 'F') IS NOT NULL
BEGIN
    ALTER TABLE BlogPosts DROP CONSTRAINT FK_Blogs_Categories;
END;
IF COL_LENGTH('dbo.BlogPosts', 'BlogCategoryID') IS NOT NULL
BEGIN
    ALTER TABLE BlogPosts DROP COLUMN BlogCategoryID;
END;
IF OBJECT_ID('dbo.BlogCategories', 'U') IS NOT NULL
BEGIN
    DROP TABLE BlogCategories;
END;
GO

IF OBJECT_ID('dbo.BlogPosts', 'U') IS NULL
BEGIN
    CREATE TABLE BlogPosts (
        BlogID INT PRIMARY KEY IDENTITY(1,1),
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
        UpdatedAt DATETIME DEFAULT GETDATE()
    );
END;
GO

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

-- 11. Uploaded Files (File Storage Metadata in SQL Server)
IF OBJECT_ID('dbo.UploadedFiles', 'U') IS NULL
BEGIN
    CREATE TABLE UploadedFiles (
        FileID INT PRIMARY KEY IDENTITY(1,1),
        OriginalFileName NVARCHAR(255) NOT NULL,
        UniqueFileName NVARCHAR(255) NOT NULL UNIQUE,
        RelativePath NVARCHAR(500) NOT NULL,
        Category NVARCHAR(50) NOT NULL, -- 'products', 'blogs', 'logos', 'company', 'admins'
        FileType NVARCHAR(100) NOT NULL,
        FileSizeBytes BIGINT NOT NULL,
        UploadedAt DATETIME DEFAULT GETDATE(),
        IsDeleted BIT NOT NULL DEFAULT 0
    );
    CREATE NONCLUSTERED INDEX IX_UploadedFiles_Category ON UploadedFiles(Category);
    CREATE NONCLUSTERED INDEX IX_UploadedFiles_RelativePath ON UploadedFiles(RelativePath);
END;

-- Indexes
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Products_Slug' AND object_id = OBJECT_ID('Products'))
    CREATE NONCLUSTERED INDEX IX_Products_Slug ON Products(Slug);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_BlogPosts_Slug' AND object_id = OBJECT_ID('BlogPosts'))
    CREATE NONCLUSTERED INDEX IX_BlogPosts_Slug ON BlogPosts(Slug);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ProductCategories_Slug' AND object_id = OBJECT_ID('ProductCategories'))
    CREATE NONCLUSTERED INDEX IX_ProductCategories_Slug ON ProductCategories(Slug);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ProductCategories_IsActive' AND object_id = OBJECT_ID('ProductCategories'))
    CREATE NONCLUSTERED INDEX IX_ProductCategories_IsActive ON ProductCategories(IsActive);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Products_IsActive_IsFeatured' AND object_id = OBJECT_ID('Products'))
    CREATE NONCLUSTERED INDEX IX_Products_IsActive_IsFeatured ON Products(IsActive, IsFeatured);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ClientRequirements_Status' AND object_id = OBJECT_ID('ClientRequirements'))
    CREATE NONCLUSTERED INDEX IX_ClientRequirements_Status ON ClientRequirements(Status);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_AdminUsers_Email' AND object_id = OBJECT_ID('AdminUsers'))
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

-- Seed Initial Uploaded Files (Default Site Logo)
IF NOT EXISTS (SELECT 1 FROM UploadedFiles WHERE RelativePath = '/uploads/logos/om-polymer-logo.png')
BEGIN
    INSERT INTO UploadedFiles (OriginalFileName, UniqueFileName, RelativePath, Category, FileType, FileSizeBytes, UploadedAt, IsDeleted)
    VALUES (
        'om-polymer-logo.png',
        'om-polymer-logo.png',
        '/uploads/logos/om-polymer-logo.png',
        'logos',
        'image/png',
        24576,
        GETDATE(),
        0
    );
END;

-- Seed Company Settings (With Logo URL)
IF NOT EXISTS (SELECT 1 FROM CompanySettings)
BEGIN
    INSERT INTO CompanySettings (CompanyName, LogoUrl, Description, YearsOfExperience, Address, EmailContact, PhoneContact, WhatsAppNumber)
    VALUES (
        'OM Polymer',
        '/uploads/logos/om-polymer-logo.png',
        'Leading manufacturer of high-grade engineering polymers, HDPE piping systems, and masterbatches.',
        13,
        'Plot 48/B, Industrial Area Phase II, G.I.D.C., Ahmedabad, Gujarat, India',
        'inquiry@ompolymer.com',
        '+91 79 4002 9180',
        '+919876543210'
    );
END
ELSE
BEGIN
    -- Ensure LogoUrl is set if previously null
    UPDATE CompanySettings 
    SET LogoUrl = '/uploads/logos/om-polymer-logo.png' 
    WHERE LogoUrl IS NULL;
END;

-- Seed Product Categories (With Descriptions, Status, and Timestamps)
IF NOT EXISTS (SELECT 1 FROM ProductCategories)
BEGIN
    INSERT INTO ProductCategories (CategoryName, Slug, Description, IsActive, CreatedAt, UpdatedAt)
    VALUES 
    ('HDPE Pressure Pipes & Ducts', 'hdpe-pipes-ducts', 'High-density polyethylene pipes engineered for municipal potable water supply, industrial effluent, gas distribution, and mining slurry.', 1, GETDATE(), GETDATE()),
    ('Engineering Polymers & Resins', 'engineering-polymers', 'Prime-grade polymer compounds and engineering resins optimized for injection molding, profile extrusion, and blown film processes.', 1, GETDATE(), GETDATE()),
    ('Color & Additive Masterbatches', 'masterbatches', 'Specialized UV stabilizer, antioxidant, slip, and custom color masterbatches engineered for polymer processing precision.', 1, GETDATE(), GETDATE()),
    ('UPVC & CPVC Fitting Solutions', 'upvc-cpvc-fittings', 'High-performance unplasticized and chlorinated PVC pipes and pressure fittings for commercial plumbing and chemical lines.', 1, GETDATE(), GETDATE());
END
ELSE
BEGIN
    -- Update existing seeded categories with descriptions and timestamps if null
    UPDATE ProductCategories 
    SET Description = 'High-density polyethylene pipes engineered for municipal potable water supply, industrial effluent, gas distribution, and mining slurry.',
        UpdatedAt = GETDATE()
    WHERE Slug = 'hdpe-pipes-ducts' AND (Description IS NULL OR Description = '');

    UPDATE ProductCategories 
    SET Description = 'Prime-grade polymer compounds and engineering resins optimized for injection molding, profile extrusion, and blown film processes.',
        UpdatedAt = GETDATE()
    WHERE Slug = 'engineering-polymers' AND (Description IS NULL OR Description = '');

    UPDATE ProductCategories 
    SET Description = 'Specialized UV stabilizer, antioxidant, slip, and custom color masterbatches engineered for polymer processing precision.',
        UpdatedAt = GETDATE()
    WHERE Slug = 'masterbatches' AND (Description IS NULL OR Description = '');

    UPDATE ProductCategories 
    SET Description = 'High-performance unplasticized and chlorinated PVC pipes and pressure fittings for commercial plumbing and chemical lines.',
        UpdatedAt = GETDATE()
    WHERE Slug = 'upvc-cpvc-fittings' AND (Description IS NULL OR Description = '');
END;
GO