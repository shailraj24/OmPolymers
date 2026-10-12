using System.Net;
using Microsoft.EntityFrameworkCore;
using OMPolymer.API.Data;
using OMPolymer.API.Data.Models;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.DTOs.Responses;
using OMPolymer.API.Services.Interfaces;

namespace OMPolymer.API.Services.Implementations
{
    public class CompanyService : ICompanyService
    {
        private readonly OMPolymerDbContext _context;

        public CompanyService(OMPolymerDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<CompanySettingsResponse>> GetSettingsAsync()
        {
            var s = await _context.CompanySettings.FirstOrDefaultAsync();
            if (s == null) return ApiResponse<CompanySettingsResponse>.FailureResponse("Settings not found.");

            var res = new CompanySettingsResponse
            {
                CompanyName = s.CompanyName,
                LogoUrl = s.LogoUrl ?? "/uploads/logos/om-polymer-logo.png",
                Description = s.Description,
                YearsOfExperience = s.YearsOfExperience ?? 13,
                AboutContent = s.AboutContent,
                Address = s.Address,
                EmailContact = s.EmailContact,
                PhoneContact = s.PhoneContact,
                WhatsAppNumber = s.WhatsAppNumber,
                SocialFacebook = s.SocialFacebook,
                SocialLinkedIn = s.SocialLinkedIn,
                SocialInstagram = s.SocialInstagram,
                WhatsAppUrl = GenerateWhatsAppUrl(s.WhatsAppNumber, "Hello, I have an inquiry regarding your products.")
            };

            return ApiResponse<CompanySettingsResponse>.SuccessResponse(res);
        }

        public async Task<ApiResponse<bool>> UpdateSettingsAsync(CompanySettingsUpdateRequest request)
        {
            var s = await _context.CompanySettings.FirstOrDefaultAsync();
            if (s == null)
            {
                s = new CompanySetting();
                _context.CompanySettings.Add(s);
            }

            s.CompanyName = request.CompanyName;
            if (!string.IsNullOrWhiteSpace(request.LogoUrl))
            {
                s.LogoUrl = request.LogoUrl;
            }
            s.Description = request.Description;
            s.YearsOfExperience = request.YearsOfExperience;
            s.AboutContent = request.AboutContent;
            s.Address = request.Address;
            s.EmailContact = request.EmailContact;
            s.PhoneContact = request.PhoneContact;
            s.WhatsAppNumber = request.WhatsAppNumber;
            s.SocialFacebook = request.SocialFacebook;
            s.SocialLinkedIn = request.SocialLinkedIn;
            s.SocialInstagram = request.SocialInstagram;
            s.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return ApiResponse<bool>.SuccessResponse(true, "Company settings updated successfully.");
        }

        public async Task<ApiResponse<bool>> UpdateLogoAsync(string logoUrl)
        {
            if (string.IsNullOrWhiteSpace(logoUrl))
            {
                return ApiResponse<bool>.FailureResponse("Logo URL cannot be empty.");
            }

            var s = await _context.CompanySettings.FirstOrDefaultAsync();
            if (s == null)
            {
                s = new CompanySetting { CompanyName = "OM Polymer" };
                _context.CompanySettings.Add(s);
            }

            s.LogoUrl = logoUrl;
            s.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return ApiResponse<bool>.SuccessResponse(true, "Site logo updated successfully.");
        }

        public string GenerateWhatsAppUrl(string? phoneNumber, string message)
        {
            if (string.IsNullOrWhiteSpace(phoneNumber)) return string.Empty;
            string clean = new string(phoneNumber.Where(char.IsDigit).ToArray());
            return $"https://wa.me/{clean}?text={WebUtility.UrlEncode(message)}";
        }
    }
}