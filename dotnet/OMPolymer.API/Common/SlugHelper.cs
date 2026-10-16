using System.Text.RegularExpressions;

namespace OMPolymer.API.Common
{
    public static class SlugHelper
    {
        public static string GenerateSlug(string? phrase)
        {
            if (string.IsNullOrWhiteSpace(phrase))
                return Guid.NewGuid().ToString("N")[..8];

            string str = phrase.ToLowerInvariant();

            // Replace invalid characters with spaces
            str = Regex.Replace(str, @"[^a-z0-9\s-]", "");

            // Convert multiple spaces into one space
            str = Regex.Replace(str, @"\s+", " ").Trim();

            // Cut and trim to max length 80 chars
            str = str.Substring(0, str.Length <= 80 ? str.Length : 80).Trim();

            // Replace spaces with hyphens
            str = Regex.Replace(str, @"\s", "-");

            // Strip redundant hyphens
            str = Regex.Replace(str, @"-+", "-").Trim('-');

            return string.IsNullOrWhiteSpace(str) ? Guid.NewGuid().ToString("N")[..8] : str;
        }
    }
}
