using System;

namespace OMPolymer.API.Data.Models
{
    public class UploadedFile
    {
        public int FileId { get; set; }
        public string OriginalFileName { get; set; } = string.Empty;
        public string UniqueFileName { get; set; } = string.Empty;
        public string RelativePath { get; set; } = string.Empty;
        public string Category { get; set; } = "products";
        public string FileType { get; set; } = "image/jpeg";
        public long FileSizeBytes { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
        public bool IsDeleted { get; set; } = false;
    }
}
