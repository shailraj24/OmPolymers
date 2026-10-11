using System.ComponentModel.DataAnnotations;

namespace OMPolymer.API.DTOs.Requests
{
    public class RequirementStatusUpdateRequest
    {
        [Required]
        public string Status { get; set; } = "New";

        public string? AdminRemarks { get; set; }
    }
}