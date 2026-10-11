namespace OMPolymer.API.DTOs.Responses
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
}