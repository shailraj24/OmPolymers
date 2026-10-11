namespace OMPolymer.API.DTOs.Responses
{
    public class CategoryResponse
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
    }

    public class ProductImageResponse
    {
        public int ImageId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
    }

    public class ProductResponse
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? ShortDescription { get; set; }
        public string? FullDescription { get; set; }
        public string? Specifications { get; set; }
        public string? MainImageUrl { get; set; }
        public bool IsFeatured { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        
        public CategoryResponse? Category { get; set; }
        public List<ProductImageResponse> AdditionalImages { get; set; } = new();
    }
}