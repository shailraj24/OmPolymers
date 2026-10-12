using Microsoft.EntityFrameworkCore;
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
        public virtual DbSet<UploadedFile> UploadedFiles { get; set; } = null!;

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

            modelBuilder.Entity<UploadedFile>(entity =>
            {
                entity.HasKey(e => e.FileId);
                entity.HasIndex(e => e.UniqueFileName).IsUnique();
                entity.HasIndex(e => e.Category);
                entity.Property(e => e.OriginalFileName).HasMaxLength(255);
                entity.Property(e => e.UniqueFileName).HasMaxLength(255);
                entity.Property(e => e.RelativePath).HasMaxLength(500);
                entity.Property(e => e.Category).HasMaxLength(50);
                entity.Property(e => e.FileType).HasMaxLength(100);
                entity.Property(e => e.IsDeleted).HasDefaultValue(false);

                entity.HasQueryFilter(e => !e.IsDeleted);
            });
        }
    }
}