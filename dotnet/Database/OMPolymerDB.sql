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
GO