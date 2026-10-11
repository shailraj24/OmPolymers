namespace OMPolymer.API.Data.Models
{
    public class ProductCategory
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    }
}