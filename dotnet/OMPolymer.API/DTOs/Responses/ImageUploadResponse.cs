namespace OMPolymer.API.DTOs.Responses
{
    public class ImageUploadResponse
    {
        public string RelativeUrl { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string OriginalFileName { get; set; } = string.Empty;
        public long FileSizeBytes { get; set; }
        public string ContentType { get; set; } = string.Empty;
    }
}