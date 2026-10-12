namespace OMPolymer.API.DTOs.Responses
{
    public class ImageUploadResponse
    {
        public int FileId { get; set; }
        public string RelativeUrl { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string OriginalFileName { get; set; } = string.Empty;
        public string UniqueFileName { get; set; } = string.Empty;
        public long FileSizeBytes { get; set; }
        public string ContentType { get; set; } = string.Empty;
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}