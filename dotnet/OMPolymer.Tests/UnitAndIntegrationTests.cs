using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using OMPolymer.API.Data;
using OMPolymer.API.Data.Models;
using OMPolymer.API.DTOs.Requests;
using OMPolymer.API.Services.Implementations;
using OMPolymer.API.Services.Interfaces;
using Xunit;

namespace OMPolymer.Tests
{
    public class AdminUserServiceTests
    {
        private OMPolymerDbContext GetInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<OMPolymerDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            return new OMPolymerDbContext(options);
        }

        [Fact]
        public async Task CreateAdmin_WithDuplicateEmail_ReturnsFailure()
        {
            using var context = GetInMemoryContext();
            context.AdminUsers.Add(new AdminUser { Email = "admin@ompolymer.com", FullName = "Admin", PasswordHash = "hash" });
            await context.SaveChangesAsync();

            var service = new AdminUserService(context, Mock.Of<ILogger<AdminUserService>>());

            var request = new AdminCreateRequest
            {
                Email = "admin@ompolymer.com",
                FullName = "Another Admin",
                Password = "Password@123",
                Role = "Admin"
            };

            var result = await service.CreateAdminAsync(request);

            Assert.False(result.Success);
            Assert.Contains("already exists", result.Message, StringComparison.OrdinalIgnoreCase);
        }

        [Fact]
        public async Task DeleteAdmin_LastActiveSuperAdmin_IsPrevented()
        {
            using var context = GetInMemoryContext();
            var superAdmin = new AdminUser { AdminId = 1, Email = "super@ompolymer.com", FullName = "Super", Role = "SuperAdmin", IsActive = true, IsDeleted = false, PasswordHash = "hash" };
            context.AdminUsers.Add(superAdmin);
            await context.SaveChangesAsync();

            var service = new AdminUserService(context, Mock.Of<ILogger<AdminUserService>>());

            var result = await service.DeleteAdminAsync(1);

            Assert.False(result.Success);
            Assert.Contains("Cannot delete the only remaining active Super Administrator", result.Message);
        }
    }

    public class PasswordRecoveryTests
    {
        private OMPolymerDbContext GetInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<OMPolymerDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            return new OMPolymerDbContext(options);
        }

        [Fact]
        public async Task ForgotPassword_ForNonExistentEmail_ReturnsGenericSuccess()
        {
            using var context = GetInMemoryContext();
            var emailServiceMock = new Mock<IEmailService>();
            var configMock = new Mock<IConfiguration>();

            var service = new AuthService(context, configMock.Object, emailServiceMock.Object, Mock.Of<ILogger<AuthService>>());

            var result = await service.ForgotPasswordAsync(new ForgotPasswordRequest { Email = "nobody@ompolymer.com" });

            // Must return success to prevent account enumeration
            Assert.True(result.Success);
            emailServiceMock.Verify(x => x.SendPasswordResetEmailAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), default), Times.Never);
        }
    }
}