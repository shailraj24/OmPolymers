namespace OMPolymer.API.Data.Models
{
    public class PasswordResetToken
    {
        public int TokenId { get; set; }
        public int AdminId { get; set; }
        public string TokenHash { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public bool IsUsed { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual AdminUser AdminUser { get; set; } = null!;
    }
}