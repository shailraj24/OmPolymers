namespace OMPolymer.API.Data.Models
{
    public class BlogCategory
    {
        public int BlogCategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;

        public virtual ICollection<BlogPost> BlogPosts { get; set; } = new List<BlogPost>();
    }
}