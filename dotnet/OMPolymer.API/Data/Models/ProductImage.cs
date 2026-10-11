namespace OMPolymer.API.Data.Models
{
    public class ProductImage
    {
        public int ImageId { get; set; }
        public int ProductId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public int? SortOrder { get; set; } = 0;

        public virtual Product Product { get; set; } = null!;
    }
}