using System.ComponentModel.DataAnnotations;

namespace OMPolymer.API.DTOs.Requests
{
    public class BlogCreateRequest
    {
        [Required, StringLength(250)]
        public string Title { get; set; } = string.Empty;

        [Required, StringLength(300)]
        public string Slug { get; set; } = string.Empty;

        public int? BlogCategoryId { get; set; }
        public string? ShortDescription { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;

        public string? FeaturedImageUrl { get; set; }
        public string? Author { get; set; }
        public string? MetaTitle { get; set; }
        public string? MetaDescription { get; set; }
        public bool IsPublished { get; set; }
    }
}