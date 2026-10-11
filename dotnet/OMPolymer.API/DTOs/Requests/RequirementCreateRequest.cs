using System.ComponentModel.DataAnnotations;

namespace OMPolymer.API.DTOs.Requests
{
    public class RequirementCreateRequest
    {
        [Required, StringLength(150)]
        public string FullName { get; set; } = string.Empty;

        [StringLength(200)]
        public string? CompanyName { get; set; }

        [Required, EmailAddress, StringLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required, Phone, StringLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;

        [StringLength(200)]
        public string? ProductOfInterest { get; set; }

        [StringLength(100)]
        public string? Quantity { get; set; }

        [Required]
        public string RequirementDescription { get; set; } = string.Empty;

        [StringLength(100)]
        public string? City { get; set; }

        [StringLength(100)]
        public string? State { get; set; }
    }
}