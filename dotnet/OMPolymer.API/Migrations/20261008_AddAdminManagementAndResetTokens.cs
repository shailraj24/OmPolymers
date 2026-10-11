using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OMPolymer.API.Migrations
{
    public partial class AddAdminManagementAndResetTokens : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "AdminUsers",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "Admin");

            migrationBuilder.AddColumn<string>(
                name: "ProfileImageUrl",
                table: "AdminUsers",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "AdminUsers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "AdminUsers",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "PasswordResetTokens",
                columns: table => new
                {
                    TokenId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AdminId = table.Column<int>(type: "int", nullable: false),
                    TokenHash = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsUsed = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PasswordResetTokens", x => x.TokenId);
                    table.ForeignKey(
                        name: "FK_PasswordResetTokens_AdminUsers",
                        column: x => x.AdminId,
                        principalTable: "AdminUsers",
                        principalColumn: "AdminId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PasswordResetTokens_AdminId",
                table: "PasswordResetTokens",
                column: "AdminId");

            migrationBuilder.CreateIndex(
                name: "IX_PasswordResetTokens_TokenHash",
                table: "PasswordResetTokens",
                column: "TokenHash");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "PasswordResetTokens");
            migrationBuilder.DropColumn(name: "Role", table: "AdminUsers");
            migrationBuilder.DropColumn(name: "ProfileImageUrl", table: "AdminUsers");
            migrationBuilder.DropColumn(name: "IsDeleted", table: "AdminUsers");
            migrationBuilder.DropColumn(name: "UpdatedAt", table: "AdminUsers");
        }
    }
}