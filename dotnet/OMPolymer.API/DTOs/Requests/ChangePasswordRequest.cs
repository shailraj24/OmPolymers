using System.ComponentModel.DataAnnotations;

namespace OMPolymer.API.DTOs.Requests
{
    public class ChangePasswordRequest
    {
        [Required]
        public string CurrentPassword { get; set; } = string.Empty;

        [Required, MinLength(8, ErrorMessage = "New password must be at least 8 characters.")]
        public string NewPassword { get; set; } = string.Empty;

        [Required, Compare("NewPassword", ErrorMessage = "Passwords do not match.")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}