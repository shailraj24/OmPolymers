using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using OMPolymer.API.Data;
using OMPolymer.API.Data.Models;
using OMPolymer.API.DTOs.Responses;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Services.Implementations
{
    public class FileStorageService : IFileStorageService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly IConfiguration _config;
        private readonly ILogger<FileStorageService> _logger;
        private readonly OMPolymerDbContext _context;

        private readonly string[] _allowedExtensions;
        private readonly string[] _allowedMimeTypes;
        private readonly long _maxFileSize;

        public FileStorageService(
            IWebHostEnvironment environment, 
            IConfiguration config, 
            ILogger<FileStorageService> logger,
            OMPolymerDbContext context)
        {
            _environment = environment;
            _config = config;
            _logger = logger;
            _context = context;

            _allowedExtensions = _config.GetSection("FileStorageSettings:AllowedExtensions").Get<string[]>() 
                ?? new[] { ".jpg", ".jpeg", ".png", ".webp", ".svg" };
            _allowedMimeTypes = _config.GetSection("FileStorageSettings:AllowedMimeTypes").Get<string[]>()
                ?? new[] { "image/jpeg", "image/png", "image/webp", "image/svg+xml" };
            _maxFileSize = _config.GetValue<long>("FileStorageSettings:MaxFileSizeInBytes", 5242880); // Default 5 MB
        }

        public async Task<ApiResponse<ImageUploadResponse>> UploadImageAsync(IFormFile file, string category, CancellationToken cancellationToken = default)
        {
            if (file == null || file.Length == 0)
            {
                return ApiResponse<ImageUploadResponse>.FailureResponse("No file was uploaded or file is empty.");
            }

            if (file.Length > _maxFileSize)
            {
                return ApiResponse<ImageUploadResponse>.FailureResponse($"File size ({file.Length / 1024} KB) exceeds the limit of {_maxFileSize / (1024 * 1024)} MB.");
            }

            // Sanitize category to prevent path traversal
            var sanitizedCategory = SanitizeCategory(category);

            // Extension validation
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!_allowedExtensions.Contains(extension))
            {
                return ApiResponse<ImageUploadResponse>.FailureResponse($"File extension '{extension}' is not permitted. Allowed formats: {string.Join(", ", _allowedExtensions)}");
            }

            // MIME type validation
            var contentType = file.ContentType.ToLowerInvariant();
            if (!_allowedMimeTypes.Contains(contentType))
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

            // Relative storage path stored in SQL Server
            var relativePath = $"/uploads/{sanitizedCategory}/{uniqueFileName}";

            _logger.LogInformation("Image stored at {PhysicalPath}, relative path: {RelativePath}", physicalPath, relativePath);

            // Persist file metadata in SQL Server
            var fileRecord = new UploadedFile
            {
                OriginalFileName = Path.GetFileName(file.FileName),
                UniqueFileName = uniqueFileName,
                RelativePath = relativePath,
                Category = sanitizedCategory,
                FileType = file.ContentType,
                FileSizeBytes = file.Length,
                UploadedAt = DateTime.UtcNow,
                IsDeleted = false
            };

            await _context.UploadedFiles.AddAsync(fileRecord, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            var response = new ImageUploadResponse
            {
                FileId = fileRecord.FileId,
                RelativeUrl = relativePath,
                Category = sanitizedCategory,
                OriginalFileName = fileRecord.OriginalFileName,
                UniqueFileName = uniqueFileName,
                FileSizeBytes = file.Length,
                ContentType = file.ContentType,
                UploadedAt = fileRecord.UploadedAt
            };

            return ApiResponse<ImageUploadResponse>.SuccessResponse(response, "Image uploaded and metadata recorded successfully.");
        }

        public async Task<bool> DeleteImageAsync(string? relativePath)
        {
            if (string.IsNullOrWhiteSpace(relativePath)) return false;

            try
            {
                // Normalize and verify path traversal safety
                var cleanPath = relativePath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
                if (!cleanPath.StartsWith("uploads" + Path.DirectorySeparatorChar))
                {
                    _logger.LogWarning("Refused to delete path outside uploads folder: {Path}", relativePath);
                    return false;
                }

                var webRoot = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var physicalPath = Path.Combine(webRoot, cleanPath);

                if (File.Exists(physicalPath))
                {
                    File.Delete(physicalPath);
                    _logger.LogInformation("Physical image deleted: {Path}", physicalPath);
                }

                // Update database record
                var record = await _context.UploadedFiles.FirstOrDefaultAsync(f => f.RelativePath == relativePath);
                if (record != null)
                {
                    record.IsDeleted = true;
                    await _context.SaveChangesAsync();
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete physical file {Path}", relativePath);
            }

            return false;
        }

        public async Task<bool> DeleteImageByIdAsync(int fileId)
        {
            var record = await _context.UploadedFiles.FindAsync(fileId);
            if (record == null) return false;

            var success = await DeleteImageAsync(record.RelativePath);
            if (success)
            {
                record.IsDeleted = true;
                await _context.SaveChangesAsync();
            }
            return success;
        }

        public async Task<ApiResponse<ImageUploadResponse>> ReplaceImageAsync(string? oldRelativePath, IFormFile newFile, string category, CancellationToken cancellationToken = default)
        {
            var uploadResult = await UploadImageAsync(newFile, category, cancellationToken);
            if (!uploadResult.Success)
            {
                return uploadResult;
            }

            // Delete old file only after new one successfully saved
            if (!string.IsNullOrWhiteSpace(oldRelativePath) && oldRelativePath != uploadResult.Data?.RelativeUrl)
            {
                await DeleteImageAsync(oldRelativePath);
            }

            return uploadResult;
        }

        public async Task<ApiResponse<IEnumerable<ImageUploadResponse>>> GetAllFilesAsync(CancellationToken cancellationToken = default)
        {
            var files = await _context.UploadedFiles
                .AsNoTracking()
                .OrderByDescending(f => f.UploadedAt)
                .Select(f => new ImageUploadResponse
                {
                    FileId = f.FileId,
                    RelativeUrl = f.RelativePath,
                    Category = f.Category,
                    OriginalFileName = f.OriginalFileName,
                    UniqueFileName = f.UniqueFileName,
                    FileSizeBytes = f.FileSizeBytes,
                    ContentType = f.FileType,
                    UploadedAt = f.UploadedAt
                })
                .ToListAsync(cancellationToken);

            return ApiResponse<IEnumerable<ImageUploadResponse>>.SuccessResponse(files);
        }

        public async Task<ApiResponse<IEnumerable<ImageUploadResponse>>> GetFilesByCategoryAsync(string category, CancellationToken cancellationToken = default)
        {
            var sanitizedCategory = SanitizeCategory(category);
            var files = await _context.UploadedFiles
                .AsNoTracking()
                .Where(f => f.Category == sanitizedCategory)
                .OrderByDescending(f => f.UploadedAt)
                .Select(f => new ImageUploadResponse
                {
                    FileId = f.FileId,
                    RelativeUrl = f.RelativePath,
                    Category = f.Category,
                    OriginalFileName = f.OriginalFileName,
                    UniqueFileName = f.UniqueFileName,
                    FileSizeBytes = f.FileSizeBytes,
                    ContentType = f.FileType,
                    UploadedAt = f.UploadedAt
                })
                .ToListAsync(cancellationToken);

            return ApiResponse<IEnumerable<ImageUploadResponse>>.SuccessResponse(files);
        }

        public async Task<ApiResponse<ImageUploadResponse>> GetFileByIdAsync(int fileId, CancellationToken cancellationToken = default)
        {
            var f = await _context.UploadedFiles.FindAsync(new object[] { fileId }, cancellationToken);
            if (f == null)
            {
                return ApiResponse<ImageUploadResponse>.FailureResponse("File metadata not found in database.");
            }

            var response = new ImageUploadResponse
            {
                FileId = f.FileId,
                RelativeUrl = f.RelativePath,
                Category = f.Category,
                OriginalFileName = f.OriginalFileName,
                UniqueFileName = f.UniqueFileName,
                FileSizeBytes = f.FileSizeBytes,
                ContentType = f.FileType,
                UploadedAt = f.UploadedAt
            };

            return ApiResponse<ImageUploadResponse>.SuccessResponse(response);
        }

        private static string SanitizeCategory(string category)
        {
            var valid = new[] { "products", "admins", "blogs", "testimonials", "company", "categories", "logos" };
            var cat = category?.Trim().ToLowerInvariant() ?? "products";
            return valid.Contains(cat) ? cat : "products";
        }
    }
}
