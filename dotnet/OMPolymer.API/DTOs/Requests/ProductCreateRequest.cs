using System.ComponentModel.DataAnnotations;

namespace OMPolymer.API.DTOs.Requests
{
    public class ProductCreateRequest
    {
        [Required, StringLength(200)]
        public string ProductName { get; set; } = string.Empty;

        [StringLength(250)]
        public string? Slug { get; set; }

        [Required]
        public int CategoryId { get; set; }

        public string? ShortDescription { get; set; }
        public string? FullDescription { get; set; }
        public string? Specifications { get; set; }
        public string? MainImageUrl { get; set; }
        public bool IsFeatured { get; set; }
        public List<string> AdditionalImages { get; set; } = new();
    }
}