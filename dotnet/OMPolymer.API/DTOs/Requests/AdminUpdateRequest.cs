using System.ComponentModel.DataAnnotations;

namespace OMPolymer.API.DTOs.Requests
{
    public class AdminUpdateRequest
    {
        [Required, StringLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required, EmailAddress, StringLength(150)]
        public string Email { get; set; } = string.Empty;

        [RegularExpression("^(SuperAdmin|Admin)$", ErrorMessage = "Role must be 'SuperAdmin' or 'Admin'.")]
        public string Role { get; set; } = "Admin";

        public string? ProfileImageUrl { get; set; }

        public bool IsActive { get; set; } = true;
    }
}