namespace OMPolymer.API.Data.Models
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
}