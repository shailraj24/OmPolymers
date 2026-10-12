using System.ComponentModel.DataAnnotations;

namespace OMPolymer.API.DTOs.Requests
{
    public class CompanySettingsUpdateRequest
    {
        [Required, StringLength(200)]
        public string CompanyName { get; set; } = string.Empty;

        public string? LogoUrl { get; set; }
        public string? Description { get; set; }
        public int YearsOfExperience { get; set; } = 13;
        public string? AboutContent { get; set; }
        public string? Address { get; set; }
        public string? EmailContact { get; set; }
        public string? PhoneContact { get; set; }
        public string? WhatsAppNumber { get; set; }
        public string? SocialFacebook { get; set; }
        public string? SocialLinkedIn { get; set; }
        public string? SocialInstagram { get; set; }
    }
}