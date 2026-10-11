using Microsoft.AspNetCore.Hosting;
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
}