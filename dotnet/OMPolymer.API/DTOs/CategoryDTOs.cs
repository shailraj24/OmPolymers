using System.ComponentModel.DataAnnotations;

namespace OMPolymer.API.DTOs
{
    public class CategoryResponseDto
    {
        public int CategoryId { get; set; }
        public int Id => CategoryId;
        public string CategoryName { get; set; } = string.Empty;
        public string Name => CategoryName;
        public string Slug { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public int ProductCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreateCategoryDto
    {
        [Required(ErrorMessage = "Category name is required.")]
        [StringLength(100, ErrorMessage = "Category name cannot exceed 100 characters.")]
        public string CategoryName { get; set; } = string.Empty;

        public string? Name
        {
            get => CategoryName;
            set { if (!string.IsNullOrWhiteSpace(value) && string.IsNullOrWhiteSpace(CategoryName)) CategoryName = value; }
        }

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;
    }

    public class UpdateCategoryDto
    {
        [Required(ErrorMessage = "Category name is required.")]
        [StringLength(100, ErrorMessage = "Category name cannot exceed 100 characters.")]
        public string CategoryName { get; set; } = string.Empty;

        public string? Name
        {
            get => CategoryName;
            set { if (!string.IsNullOrWhiteSpace(value) && string.IsNullOrWhiteSpace(CategoryName)) CategoryName = value; }
        }

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
