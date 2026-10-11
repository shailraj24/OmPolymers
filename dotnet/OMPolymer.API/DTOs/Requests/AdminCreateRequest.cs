using System.ComponentModel.DataAnnotations;

namespace OMPolymer.API.DTOs.Requests
{
    public class AdminCreateRequest
    {
        [Required, StringLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required, EmailAddress, StringLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required, MinLength(8, ErrorMessage = "Password must be at least 8 characters.")]
        public string Password { get; set; } = string.Empty;

        [RegularExpression("^(SuperAdmin|Admin)$", ErrorMessage = "Role must be 'SuperAdmin' or 'Admin'.")]
        public string Role { get; set; } = "Admin";

        public string? ProfileImageUrl { get; set; }

        public bool IsActive { get; set; } = true;
    }
}