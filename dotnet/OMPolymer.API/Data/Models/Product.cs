namespace OMPolymer.API.Data.Models
{
    public class Product
    {
        public int ProductId { get; set; }
        public int CategoryId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? ShortDescription { get; set; }
        public string? FullDescription { get; set; }
        public string? Specifications { get; set; }
        public string? MainImageUrl { get; set; }
        public bool IsFeatured { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public virtual ProductCategory Category { get; set; } = null!;
        public virtual ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();
    }
}