using System.ComponentModel.DataAnnotations;

namespace OMPolymer.API.DTOs.Requests
{
    public class TestimonialCreateRequest
    {
        [Required, StringLength(150)]
        public string DisplayName { get; set; } = string.Empty;

        [StringLength(200)]
        public string? CompanyOrDesignation { get; set; }

        [Required]
        public string ReviewText { get; set; } = string.Empty;

        [Range(1, 5)]
        public int Rating { get; set; } = 5;

        public bool IsApproved { get; set; }
        public bool IsPublished { get; set; }
    }
}