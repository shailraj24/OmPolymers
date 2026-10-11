namespace OMPolymer.API.Data.Models
{
    public class ClientRequirement
    {
        public int RequirementId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? CompanyName { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? ProductOfInterest { get; set; }
        public string? Quantity { get; set; }
        public string RequirementDescription { get; set; } = string.Empty;
        public string? City { get; set; }
        public string? State { get; set; }
        public string Status { get; set; } = "New";
        public string? AdminRemarks { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}